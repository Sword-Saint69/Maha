"use client";

import { useState, useEffect, useMemo } from 'react';
import type { MusicFile, MusicStats } from '@/electron/electron.d';
import { StatsManager } from '@/lib/music-library';
import {
  IconChartBar,
  IconClock,
  IconDisc,
  IconMusic,
  IconPlayerPlay,
  IconTrendingUp,
  IconUsers,
  IconVinyl,
  IconChartPie,
  IconHistory,
} from '@tabler/icons-react';

interface StatsPageProps {
  allTracks: MusicFile[];
  onPlayTrack: (track: MusicFile) => void;
}

export default function StatsPage({ allTracks, onPlayTrack }: StatsPageProps) {
  const [stats, setStats] = useState<MusicStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tracks' | 'artists' | 'genres' | 'history'>('overview');

  useEffect(() => {
    if (allTracks.length > 0) {
      const musicStats = StatsManager.getMusicStats(allTracks);
      setStats(musicStats);
    }
  }, [allTracks]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
    <div 
      className="p-6 rounded-lg transition-all hover:scale-[1.02]"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        border: '1px solid'
      }}
    >
      <div className="flex items-center gap-4">
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1">
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
          <div className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
        </div>
      </div>
    </div>
  );

  if (!stats) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <IconChartBar className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No statistics available yet</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Start playing music to see your listening stats
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Your Music Statistics
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Insights into your listening habits and favorite music
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: IconChartPie },
          { id: 'tracks', label: 'Top Tracks', icon: IconMusic },
          { id: 'artists', label: 'Top Artists', icon: IconUsers },
          { id: 'genres', label: 'Genres', icon: IconVinyl },
          { id: 'history', label: 'History', icon: IconHistory },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className="px-4 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-2"
            style={{
              backgroundColor: selectedTab === tab.id ? 'var(--color-primary)' : 'var(--bg-card)',
              color: selectedTab === tab.id ? 'white' : 'var(--text-primary)',
              borderColor: 'var(--border-color)',
              border: '1px solid'
            }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={IconMusic}
              label="Total Tracks"
              value={stats.totalTracks.toLocaleString()}
              color="var(--color-primary)"
            />
            <StatCard
              icon={IconClock}
              label="Total Play Time"
              value={formatTime(stats.totalPlayTime)}
              color="var(--color-accent)"
            />
            <StatCard
              icon={IconPlayerPlay}
              label="Most Played"
              value={stats.mostPlayedTracks[0]?.playCount || 0}
              color="var(--color-secondary)"
            />
            <StatCard
              icon={IconTrendingUp}
              label="Recently Played"
              value={stats.recentlyPlayed.length}
              color="#10b981"
            />
          </div>

          {/* Top 3 Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Tracks */}
            <div 
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                border: '1px solid'
              }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <IconMusic className="w-5 h-5" />
                Top Tracks
              </h3>
              <div className="space-y-3">
                {stats.mostPlayedTracks.slice(0, 3).map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                    onClick={() => onPlayTrack(item.track)}
                  >
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                      style={{ 
                        backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                        color: 'white'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm" style={{ color: 'var(--text-primary)' }}>
                        {item.track.title}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {item.playCount} plays
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div 
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                border: '1px solid'
              }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <IconUsers className="w-5 h-5" />
                Top Artists
              </h3>
              <div className="space-y-3">
                {stats.mostPlayedArtists.slice(0, 3).map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                      style={{ 
                        backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                        color: 'white'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm" style={{ color: 'var(--text-primary)' }}>
                        {item.artist}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {item.playCount} plays
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Genres */}
            <div 
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                border: '1px solid'
              }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <IconVinyl className="w-5 h-5" />
                Top Genres
              </h3>
              <div className="space-y-3">
                {stats.mostPlayedGenres.slice(0, 3).map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                      style={{ 
                        backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                        color: 'white'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm" style={{ color: 'var(--text-primary)' }}>
                        {item.genre}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {item.playCount} plays
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Tracks Tab */}
      {selectedTab === 'tracks' && (
        <div 
          className="rounded-lg p-6"
          style={{ 
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            border: '1px solid'
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Most Played Tracks
          </h2>
          <div className="space-y-2">
            {stats.mostPlayedTracks.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg transition-all hover:scale-[1.01] cursor-pointer"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                onClick={() => onPlayTrack(item.track)}
              >
                <div className="text-lg font-bold w-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                  {index + 1}
                </div>
                <img
                  src={item.track.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=40&h=40&auto=format&fit=crop&q=60'}
                  alt={item.track.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.track.title}
                  </div>
                  <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {item.track.artist} · {item.track.album}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: 'var(--color-primary)' }}>
                    {item.playCount} plays
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatTime(item.track.duration * item.playCount)}
                  </div>
                </div>
                <button
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  <IconPlayerPlay className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Artists Tab */}
      {selectedTab === 'artists' && (
        <div 
          className="rounded-lg p-6"
          style={{ 
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            border: '1px solid'
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Most Played Artists
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.mostPlayedArtists.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg transition-all hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {item.artist}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total plays</span>
                  <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{item.playCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genres Tab */}
      {selectedTab === 'genres' && (
        <div 
          className="rounded-lg p-6"
          style={{ 
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            border: '1px solid'
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Genre Distribution
          </h2>
          <div className="space-y-4">
            {stats.mostPlayedGenres.map((item, index) => {
              const totalPlays = stats.mostPlayedGenres.reduce((sum, g) => sum + g.playCount, 0);
              const percentage = (item.playCount / totalPlays) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {item.genre}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {item.playCount} plays ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ 
                        backgroundColor: 'var(--color-primary)',
                        width: `${percentage}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Tab */}
      {selectedTab === 'history' && (
        <div 
          className="rounded-lg p-6"
          style={{ 
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            border: '1px solid'
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Recently Played
          </h2>
          <div className="space-y-2">
            {stats.recentlyPlayed.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg transition-all hover:scale-[1.01] cursor-pointer"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                onClick={() => onPlayTrack(item.track)}
              >
                <img
                  src={item.track.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=40&h=40&auto=format&fit=crop&q=60'}
                  alt={item.track.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.track.title}
                  </div>
                  <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {item.track.artist}
                  </div>
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(item.timestamp)}
                </div>
                <button
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  <IconPlayerPlay className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
