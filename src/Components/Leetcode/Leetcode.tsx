"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Window, WindowContent, WindowHeader, Button, Panel, Separator } from 'react95';
import Draggable from 'react-draggable';
import styled, { createGlobalStyle } from 'styled-components';

// ==========================================
// WIN95 GLOBAL FONT
// ==========================================
const Win95Font = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
`;

// ==========================================
// WIN95 DESIGN TOKENS
// ==========================================
const C = {
  silver:     '#c0c0c0',
  darkGrey:   '#808080',
  white:      '#ffffff',
  black:      '#000000',
  navy:       '#000080',
  teal:       '#008080',
  highlight:  '#0000aa',
  hiText:     '#ffffff',
  btnFace:    '#c0c0c0',
  btnShadow:  '#808080',
  btnLight:   '#ffffff',
  btnDark:    '#404040',
  green:      '#008000',
  lime:       '#00ff00',
  yellow:     '#808000',
  red:        '#800000',
  easy:       '#008080',   // teal for easy
  med:        '#808000',   // olive for medium
  hard:       '#800000',   // maroon for hard
  heatEmpty:  '#c0c0c0',
  heat1:      '#99c4c4',
  heat2:      '#008080',
  heat3:      '#004444',
};

// ==========================================
// WIN95 BEVEL MIXINS
// ==========================================
const inset = `
  border-top: 2px solid ${C.btnShadow};
  border-left: 2px solid ${C.btnShadow};
  border-bottom: 2px solid ${C.btnLight};
  border-right: 2px solid ${C.btnLight};
`;

const outset = `
  border-top: 2px solid ${C.btnLight};
  border-left: 2px solid ${C.btnLight};
  border-bottom: 2px solid ${C.btnDark};
  border-right: 2px solid ${C.btnDark};
`;

// ==========================================
// STYLED COMPONENTS
// ==========================================

const Win95Body = styled.div`
  background: ${C.silver};
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  font-size: 11px;
  color: ${C.black};
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  /* Fixed height window, internal scroll */
  max-height: 520px;
  overflow: hidden;
`;

/** The sunken inset display area */
const InsetPanel = styled.div`
  ${inset}
  background: ${C.white};
  padding: 6px;
`;

/** Section label — looks like a group box title */
const GroupLabel = styled.div`
  font-size: 11px;
  font-weight: bold;
  color: ${C.black};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${C.btnShadow};
    box-shadow: 0 1px 0 ${C.btnLight};
  }
`;

// ---- STATS ROW ----
const StatsRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
`;

const BigNum = styled.span`
  font-size: 32px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  color: ${C.navy};
  line-height: 1;
`;

const SmallLabel = styled.span`
  font-size: 11px;
  color: ${C.darkGrey};
`;

// ---- WIN95 PROGRESS BAR ----
const ProgressTrack = styled.div`
  ${inset}
  height: 16px;
  background: ${C.white};
  display: flex;
  overflow: hidden;
  margin: 4px 0;
`;

const ProgressChunk = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${p => p.$width}%;
  background: ${p => p.$color};
  /* Classic chunky progress bar style */
  background-image: repeating-linear-gradient(
    90deg,
    ${p => p.$color} 0px,
    ${p => p.$color} 10px,
    ${p => p.$color}cc 10px,
    ${p => p.$color}cc 12px
  );
  transition: width 0.4s ease;
`;

// ---- DIFFICULTY LEGEND ----
const DiffLegend = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
`;

const DiffItem = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: bold;
  color: ${C.black};

  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background: ${p => p.$color};
    ${outset}
  }
`;

// ---- HEATMAP ----
const HeatmapScroll = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 4px;

  &::-webkit-scrollbar { height: 12px; }
  &::-webkit-scrollbar-track { ${inset} background: ${C.silver}; }
  &::-webkit-scrollbar-thumb { ${outset} background: ${C.silver}; }
`;

const HeatmapGrid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-rows: repeat(7, 10px);
  grid-template-columns: repeat(${p => p.$cols}, 10px);
  grid-auto-flow: column;
  gap: 2px;
  width: max-content;
`;

const HeatCell = styled.div<{ $level: number }>`
  width: 10px;
  height: 10px;
  ${outset}
  background-color: ${({ $level }) =>
    $level === 0 ? C.heatEmpty :
    $level === 1 ? C.heat1 :
    $level === 2 ? C.heat2 :
    C.heat3};
  cursor: default;
`;

// ---- TOPICS ----
const TopicsScroll = styled.div`
  max-height: 130px;
  overflow-y: auto;
  ${inset}
  background: ${C.white};

  &::-webkit-scrollbar { width: 14px; }
  &::-webkit-scrollbar-track { ${inset} background: ${C.silver}; }
  &::-webkit-scrollbar-thumb { ${outset} background: ${C.silver}; }
`;

const TopicRow = styled.div<{ $selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 2px 6px;
  background: ${p => p.$selected ? C.highlight : 'transparent'};
  color: ${p => p.$selected ? C.hiText : C.black};
  cursor: default;
  user-select: none;

  &:hover {
    background: ${C.highlight};
    color: ${C.hiText};
  }

  span:first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
  }

  span:last-child {
    font-weight: bold;
  }
`;

// ---- STATUS BAR ----
const StatusBar = styled.div`
  display: flex;
  gap: 2px;
  border-top: 1px solid ${C.btnShadow};
  padding-top: 4px;
`;

const StatusCell = styled.div`
  ${inset}
  padding: 2px 6px;
  font-size: 11px;
  flex: 1;
`;

// ==========================================
// INTERFACES
// ==========================================
interface LeetCodeProps {
  onClose: () => void;
  username?: string;
}

interface HeatmapData {
  date: string;
  level: number;
  count: number;
}

// ==========================================
// COMPONENT
// ==========================================
export default function LeetCode({ onClose, username = 'sudhanshu_5669' }: LeetCodeProps) {
  const nodeRef = useRef(null);

  const [data, setData] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const [topics, setTopics] = useState([
    { tagName: 'Array',              problemsSolved: 42 },
    { tagName: 'String',             problemsSolved: 31 },
    { tagName: 'Hash Table',         problemsSolved: 24 },
    { tagName: 'Dynamic Programming',problemsSolved: 18 },
    { tagName: 'Math',               problemsSolved: 12 },
    { tagName: 'Sorting',            problemsSolved: 9  },
  ]);

  // ---- Heatmap builder ----
  // Heatmap Parser
  const buildHeatmap = (calendarData: any) => {
    // THE FIX: Check if it's already an object before parsing!
    let parsed = {};
    if (typeof calendarData === 'string') {
      try { parsed = JSON.parse(calendarData || "{}"); } catch (e) {}
    } else if (typeof calendarData === 'object' && calendarData !== null) {
      parsed = calendarData;
    }

    const countMap: Record<string, number> = {};
    for (const [timestamp, count] of Object.entries(parsed)) {
      // LeetCode timestamps are in seconds, JS Date needs milliseconds
      const date = new Date(parseInt(timestamp) * 1000);
      const dateString = date.toISOString().split('T')[0];
      countMap[dateString] = count as number;
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (52 * 7)); // Go back 1 year
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Align to Sunday

    const grid = [];
    for (let i = 0; i < 371; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const ds = d.toISOString().split('T')[0];
      
      if (d > today) break;

      const count = countMap[ds] || 0;
      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5) level = 3;
      
      grid.push({ date: ds, level, count });
    }
    return grid;
  };

  useEffect(() => {
    fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
      .then(r => r.json())
      .then(json => {
        if (json.status === 'success') {
          setData(json);
          setHeatmap(buildHeatmap(json.submissionCalendar));
        } else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    fetch(`https://alfa-leetcode-api.onrender.com/${username}/skill`)
      .then(r => r.json())
      .then(json => {
        if (json.data?.matchedUser) {
          const t = json.data.matchedUser.tagProblemCounts;
          const all = [...(t.advanced || []), ...(t.intermediate || []), ...(t.fundamental || [])];
          all.sort((a, b) => b.problemsSolved - a.problemsSolved);
          if (all.length > 0) setTopics(all.slice(0, 12));
        }
      }).catch(() => {});
  }, [username]);

  // Compute heatmap column count
  const heatCols = heatmap.length > 0 ? Math.ceil(heatmap.length / 7) : 53;

  return (
    <>
      <Win95Font />
      <Draggable nodeRef={nodeRef} handle=".window-header" bounds="parent">
        <Window
          ref={nodeRef}
          style={{ width: 460, position: 'absolute', top: '8%', left: '18%', zIndex: 105 }}
        >
          {/* ── TITLE BAR ── */}
          <WindowHeader
            className="window-header"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>📊 LeetCode Statistics</span>
            <Button onClick={onClose} style={{ marginRight: -4 }}>
              <span style={{ fontWeight: 'bold', fontSize: 12 }}>✕</span>
            </Button>
          </WindowHeader>

          <WindowContent style={{ padding: 0 }}>
            <Win95Body>

              {/* ── STATUS: user row ── */}
              <InsetPanel style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><b>User:</b> {username}</span>
                <span style={{
                  fontWeight: 'bold',
                  color: loading ? C.yellow : error ? C.red : C.green
                }}>
                  {loading ? '⏳ Connecting…' : error ? '✖ Offline' : '✔ Connected'}
                </span>
              </InsetPanel>

              {/* ── LOADING STATE ── */}
              {loading && (
                <InsetPanel style={{ textAlign: 'center', padding: 24, color: C.darkGrey }}>
                  Loading data, please wait…
                </InsetPanel>
              )}

              {/* ── ERROR STATE ── */}
              {error && !loading && (
                <InsetPanel style={{ textAlign: 'center', padding: 24, color: C.red }}>
                  ✖ Could not retrieve data from server.
                </InsetPanel>
              )}

              {/* ── MAIN DATA ── */}
              {data && !loading && !error && (
                <>
                  {/* TOTAL SOLVED */}
                  <div>
                    <GroupLabel>Problems Solved</GroupLabel>
                    <InsetPanel>
                      <StatsRow>
                        <BigNum>{data.totalSolved}</BigNum>
                        <SmallLabel>of {data.totalQuestions} total</SmallLabel>
                      </StatsRow>

                      <ProgressTrack title={`Easy: ${data.easySolved} | Medium: ${data.mediumSolved} | Hard: ${data.hardSolved}`}>
                        <ProgressChunk $width={(data.easySolved   / data.totalSolved) * 100} $color={C.easy} />
                        <ProgressChunk $width={(data.mediumSolved / data.totalSolved) * 100} $color={C.med}  />
                        <ProgressChunk $width={(data.hardSolved   / data.totalSolved) * 100} $color={C.hard} />
                      </ProgressTrack>

                      <DiffLegend>
                        <DiffItem $color={C.easy}>Easy &nbsp; {data.easySolved}</DiffItem>
                        <DiffItem $color={C.med} >Medium {data.mediumSolved}</DiffItem>
                        <DiffItem $color={C.hard}>Hard &nbsp; {data.hardSolved}</DiffItem>
                      </DiffLegend>
                    </InsetPanel>
                  </div>

                  {/* HEATMAP */}
                  <div>
                    <GroupLabel>Submission History</GroupLabel>
                    <InsetPanel style={{ padding: '6px 4px' }}>
                      <HeatmapScroll>
                        <HeatmapGrid $cols={heatCols}>
                          {heatmap.map((cell, i) => (
                            <HeatCell
                              key={i}
                              $level={cell.level}
                              title={`${cell.date}: ${cell.count} submission${cell.count !== 1 ? 's' : ''}`}
                            />
                          ))}
                        </HeatmapGrid>
                      </HeatmapScroll>

                      {/* Legend */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 10, color: C.darkGrey }}>
                        <span>Less</span>
                        {[0, 1, 2, 3].map(l => (
                          <HeatCell key={l} $level={l} style={{ flexShrink: 0 }} />
                        ))}
                        <span>More</span>
                      </div>
                    </InsetPanel>
                  </div>

                  {/* TOPICS */}
                  <div>
                    <GroupLabel>Top Topics</GroupLabel>
                    <TopicsScroll>
                      {topics.map((t, i) => (
                        <TopicRow
                          key={i}
                          $selected={selectedTopic === i}
                          onMouseDown={() => setSelectedTopic(i)}
                        >
                          <span>{t.tagName}</span>
                          <span>{t.problemsSolved}</span>
                        </TopicRow>
                      ))}
                    </TopicsScroll>
                  </div>
                </>
              )}

              {/* ── STATUS BAR ── */}
              <StatusBar>
                <StatusCell>
                  {loading ? 'Fetching…' : error ? 'Error' : `Rank: ${data?.ranking?.toLocaleString() ?? '—'}`}
                </StatusCell>
                <StatusCell>
                  {data ? `Streak: ${data.streak ?? 0} days` : 'Offline'}
                </StatusCell>
                <StatusCell style={{ flex: 0, whiteSpace: 'nowrap' }}>
                  leetcode.com
                </StatusCell>
              </StatusBar>

            </Win95Body>
          </WindowContent>
        </Window>
      </Draggable>
    </>
  );
}