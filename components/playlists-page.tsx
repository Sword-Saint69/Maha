"use client";

import { useState, useEffect } from 'react';
import type { Playlist, MusicFile } from '@/electron/electron.d';
import { PlaylistManager } from '@/lib/music-library';
import { 
  IconPlus, 
  IconTrash, 
  IconEdit, 
  IconMusic, 
  IconPlayerPlay,
  IconDots,
  IconDownload,
  IconUpload,
  IconStar,
  IconX
} from '@tabler/icons-react';

interface PlaylistsPageProps {
  allTracks: MusicFile[];
  onPlayTrack: (track: MusicFile) => void;
  onPlayPlaylist: (tracks: MusicFile[]) => void;
}

export default function PlaylistsPage({ allTracks, onPlayTrack, onPlayPlaylist }: PlaylistsPageProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [draggedTrackIndex, setDraggedTrackIndex] = useState<number | null>(null);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    const loadedPlaylists = PlaylistManager.getAllPlaylists();
    setPlaylists(loadedPlaylists);
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    PlaylistManager.createPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim() || undefined);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setShowCreateModal(false);
    loadPlaylists();
  };

  const handleDeletePlaylist = (id: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      PlaylistManager.deletePlaylist(id);
      if (selectedPlaylist?.id === id) {
        setSelectedPlaylist(null);
      }
      loadPlaylists();
    }
  };

  const handleUpdatePlaylist = () => {
    if (!selectedPlaylist || !newPlaylistName.trim()) return;
    
    PlaylistManager.updatePlaylist(selectedPlaylist.id, {
      name: newPlaylistName.trim(),
      description: newPlaylistDescription.trim() || undefined,
    });
    
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setShowEditModal(false);
    loadPlaylists();
    
    // Update selected playlist
    const updated = PlaylistManager.getPlaylist(selectedPlaylist.id);
    if (updated) setSelectedPlaylist(updated);
  };

  const handleRemoveTrack = (trackPath: string) => {
    if (!selectedPlaylist) return;
    
    PlaylistManager.removeTrackFromPlaylist(selectedPlaylist.id, trackPath);
    const updated = PlaylistManager.getPlaylist(selectedPlaylist.id);
    if (updated) setSelectedPlaylist(updated);
    loadPlaylists();
  };

  const handleDragStart = (index: number) => {
    setDraggedTrackIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedTrackIndex === null || !selectedPlaylist) return;
    
    PlaylistManager.reorderPlaylist(selectedPlaylist.id, draggedTrackIndex, dropIndex);
    const updated = PlaylistManager.getPlaylist(selectedPlaylist.id);
    if (updated) setSelectedPlaylist(updated);
    
    setDraggedTrackIndex(null);
    loadPlaylists();
  };

  const handleExportM3U = (playlist: Playlist) => {
    const content = PlaylistManager.exportToM3U(playlist, allTracks);
    const blob = new Blob([content], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlist.name}.m3u`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPLS = (playlist: Playlist) => {
    const content = PlaylistManager.exportToPLS(playlist, allTracks);
    const blob = new Blob([content], { type: 'audio/x-scpls' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlist.name}.pls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const content = await file.text();
    let tracks: string[] = [];
    
    if (file.name.endsWith('.m3u') || file.name.endsWith('.m3u8')) {
      tracks = PlaylistManager.importFromM3U(content);
    } else if (file.name.endsWith('.pls')) {
      tracks = PlaylistManager.importFromPLS(content);
    }
    
    if (tracks.length > 0) {
      const playlistName = file.name.replace(/\.(m3u|m3u8|pls)$/, '');
      const playlist = PlaylistManager.createPlaylist(playlistName);
      PlaylistManager.addTracksToPlaylist(playlist.id, tracks);
      loadPlaylists();
    }
    
    e.target.value = '';
  };

  const getPlaylistTracks = (playlist: Playlist): MusicFile[] => {
    return playlist.tracks
      .map(path => allTracks.find(t => t.filePath === path))
      .filter(Boolean) as MusicFile[];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Playlists
        </h1>
        <div className="flex gap-3">
          <label className="px-4 py-2 rounded-lg border transition-all cursor-pointer hover:scale-105"
            style={{ 
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}>
            <IconUpload className="w-5 h-5 inline mr-2" />
            Import
            <input type="file" accept=".m3u,.m3u8,.pls" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <IconPlus className="w-5 h-5 inline mr-2" />
            New Playlist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playlists List */}
        <div className="lg:col-span-1 space-y-3">
          {playlists.length === 0 ? (
            <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
              <IconMusic className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No playlists yet</p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                Create your first playlist to get started
              </p>
            </div>
          ) : (
            playlists.map(playlist => {
              const tracks = getPlaylistTracks(playlist);
              const totalDuration = tracks.reduce((sum, t) => sum + t.duration, 0);
              
              return (
                <div
                  key={playlist.id}
                  onClick={() => setSelectedPlaylist(playlist)}
                  className="p-4 rounded-lg cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: selectedPlaylist?.id === playlist.id ? 'var(--color-primary)' : 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    border: '1px solid'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate mb-1" style={{ color: selectedPlaylist?.id === playlist.id ? 'white' : 'var(--text-primary)' }}>
                        {playlist.isSmart && <IconStar className="w-4 h-4 inline mr-1" />}
                        {playlist.name}
                      </h3>
                      <p className="text-sm truncate" style={{ color: selectedPlaylist?.id === playlist.id ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>
                        {playlist.tracks.length} songs · {formatDuration(totalDuration)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Playlist Details */}
        <div className="lg:col-span-2">
          {selectedPlaylist ? (
            <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', border: '1px solid' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {selectedPlaylist.name}
                  </h2>
                  {selectedPlaylist.description && (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {selectedPlaylist.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const tracks = getPlaylistTracks(selectedPlaylist);
                      if (tracks.length > 0) onPlayPlaylist(tracks);
                    }}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    title="Play playlist"
                  >
                    <IconPlayerPlay className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setNewPlaylistName(selectedPlaylist.name);
                      setNewPlaylistDescription(selectedPlaylist.description || '');
                      setShowEditModal(true);
                    }}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    title="Edit playlist"
                  >
                    <IconEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleExportM3U(selectedPlaylist)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    title="Export as M3U"
                  >
                    <IconDownload className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePlaylist(selectedPlaylist.id)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ backgroundColor: '#ef4444', color: 'white' }}
                    title="Delete playlist"
                  >
                    <IconTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {getPlaylistTracks(selectedPlaylist).map((track, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className="flex items-center gap-4 p-3 rounded-lg transition-all cursor-move hover:scale-[1.01]"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <span className="text-sm w-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                      {index + 1}
                    </span>
                    <img
                      src={track.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=40&h=40&auto=format&fit=crop&q=60'}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {track.title}
                      </div>
                      <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                        {track.artist}
                      </div>
                    </div>
                    <button
                      onClick={() => onPlayTrack(track)}
                      className="p-2 rounded-lg transition-all hover:scale-110"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      <IconPlayerPlay className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveTrack(track.filePath)}
                      className="p-2 rounded-lg transition-all hover:scale-110"
                      style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                    >
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Select a playlist to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-lg p-6 w-full max-w-md" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg mb-3"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg mb-4 resize-none"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName('');
                  setNewPlaylistDescription('');
                }}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                disabled={!newPlaylistName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-lg p-6 w-full max-w-md" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Edit Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg mb-3"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg mb-4 resize-none"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setNewPlaylistName('');
                  setNewPlaylistDescription('');
                }}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePlaylist}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                disabled={!newPlaylistName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
