"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Window, WindowContent, WindowHeader, Button, Panel } from 'react95';
import Draggable from 'react-draggable';
import styled from 'styled-components';

// ==========================================
// STYLED COMPONENTS (Hacker Terminal Aesthetic)
// ==========================================

const MainframeData = styled.div`
  background: #000;
  color: #00ff00; /* Classic CRT Phosphor Green */
  font-family: 'Courier New', Courier, monospace;
  padding: 12px;
  border: 2px inset #dfdfdf;
  display: flex;
  flex-direction: column;
  gap: 8px;
  user-select: none;
`;

const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px dashed #008000;
  padding-bottom: 4px;
  margin-bottom: 8px;
  font-weight: bold;
`;

const BigTotal = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;

  .label { font-size: 14px; color: #80ff80; }
  .number { font-size: 42px; font-weight: bold; color: #00ff00; text-shadow: 0 0 8px #00ff00; }
  .total { font-size: 16px; color: #008000; }
`;

const CombinedBar = styled.div`
  display: flex;
  height: 14px;
  width: 100%;
  border: 1px solid #808080;
  border-right-color: #fff;
  border-bottom-color: #fff;
  background: #001100;
  margin-top: 4px;
`;

const Segment = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background-color: ${({ $color }) => $color};
`;

const DiffRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 4px;
  font-weight: bold;
  
  .easy { color: #00ffff; } /* Cyan */
  .med { color: #ffff00; }  /* Yellow */
  .hard { color: #ff0000; } /* Red */
`;

const SectionTitle = styled.div`
  font-size: 12px;
  border-bottom: 1px solid #008000;
  padding-bottom: 2px;
  margin-top: 12px;
  color: #00ff00;
`;

// --- HEATMAP (DEFRAGGER STYLE) ---
const HeatmapContainer = styled.div`
  overflow-x: auto;
  padding-bottom: 6px;
  margin-top: 4px;
  
  &::-webkit-scrollbar { height: 10px; }
  &::-webkit-scrollbar-track { background: #001100; border: 1px solid #003300; }
  &::-webkit-scrollbar-thumb { background: #008000; border: 1px solid #00ff00; }
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 2px;
`;

const HeatmapCell = styled.div<{ $level: number }>`
  width: 8px;
  height: 8px;
  background-color: ${({ $level }) => 
    $level === 0 ? '#001100' : 
    $level === 1 ? '#005500' : 
    $level === 2 ? '#00aa00' : 
    '#00ff00'};
  border: 1px solid #000;
`;

// --- TOPICS ---
const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 4px;
`;

const TopicPill = styled.div`
  display: flex;
  justify-content: space-between;
  background: #003300;
  color: #00ff00;
  padding: 4px 6px;
  font-size: 11px;
  border: 1px solid #00ff00;
`;

// ==========================================
// INTERFACES & LOGIC
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

export default function LeetCode({ onClose, username = 'sudhanshu_5669' }: LeetCodeProps) {
  const nodeRef = useRef(null);
  
  const [data, setData] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Start with mock topics so the UI looks amazing instantly
  const [topics, setTopics] = useState([
    { tagName: "Arrays", problemsSolved: 42 },
    { tagName: "Strings", problemsSolved: 31 },
    { tagName: "Hash Table", problemsSolved: 24 },
    { tagName: "Dynamic Programming", problemsSolved: 18 },
    { tagName: "Math", problemsSolved: 12 },
    { tagName: "Sorting", problemsSolved: 9 },
  ]);

  // Heatmap Parser
  const generateHeatmapData = (calendarData: string) => {
    let parsed = {};
    try { parsed = JSON.parse(calendarData || "{}"); } catch (e) {}

    const countMap: Record<string, number> = {};
    for (const [timestamp, count] of Object.entries(parsed)) {
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
    // 1. Fetch Fast Stats (Totals & Calendar)
    fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
      .then(res => res.json())
      .then((json) => {
        if (json.status === "success") {
          setData(json);
          setHeatmap(generateHeatmapData(json.submissionCalendar));
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    // 2. Fetch Slow Topics (Runs in background, silently fails if server is asleep)
    fetch(`https://alfa-leetcode-api.onrender.com/${username}/skill`)
      .then(res => res.json())
      .then(json => {
         if (json.data?.matchedUser) {
           const tags = json.data.matchedUser.tagProblemCounts;
           const allTags = [
              ...(tags.advanced || []),
              ...(tags.intermediate || []),
              ...(tags.fundamental || [])
           ];
           allTags.sort((a, b) => b.problemsSolved - a.problemsSolved);
           if (allTags.length > 0) {
             setTopics(allTags.slice(0, 6)); // Overwrite mock data with live data
           }
         }
      }).catch(() => {});
  }, [username]);

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header" bounds="parent">
      <Window ref={nodeRef} style={{ width: '450px', position: 'absolute', top: '10%', left: '20%', zIndex: 105 }}>
        <WindowHeader className="window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💻 LC_DIAGNOSTICS.EXE</span>
          <Button onClick={onClose}><span style={{ fontWeight: 'bold' }}>x</span></Button>
        </WindowHeader>
        
        <WindowContent style={{ padding: '8px' }}>
          <Panel variant="well" style={{ padding: '4px', background: '#c0c0c0' }}>
            <MainframeData>
              
              <TerminalHeader>
                <span>USER: {username}</span>
                <span style={{ color: loading ? '#ffff00' : error ? '#ff0000' : '#00ff00' }}>
                  {loading ? 'DIALING...' : error ? 'OFFLINE' : 'CONNECTED'}
                </span>
              </TerminalHeader>

              {loading && <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Blinking into the mainframe...</div>}
              {error && !loading && <div style={{ height: '200px', color: 'red' }}>FATAL ERROR: Could not retrieve data.</div>}

              {data && !loading && !error && (
                <>
                  {/* --- TOTALS & DIFFICULTY --- */}
                  <div>
                    <BigTotal>
                      <span className="label">TOTAL SOLVED:</span>
                      <span className="number">{data.totalSolved}</span>
                      <span className="total">/ {data.totalQuestions}</span>
                    </BigTotal>
                    
                    <CombinedBar>
                      <Segment $width={(data.easySolved / data.totalSolved) * 100} $color="#00ffff" />
                      <Segment $width={(data.mediumSolved / data.totalSolved) * 100} $color="#ffff00" />
                      <Segment $width={(data.hardSolved / data.totalSolved) * 100} $color="#ff0000" />
                    </CombinedBar>

                    <DiffRow>
                      <span className="easy">EASY: {data.easySolved}</span>
                      <span className="med">MED: {data.mediumSolved}</span>
                      <span className="hard">HARD: {data.hardSolved}</span>
                    </DiffRow>
                  </div>

                  {/* --- HEATMAP --- */}
                  <div>
                    <SectionTitle>&gt; SUBMISSION_HEATMAP.DAT</SectionTitle>
                    <HeatmapContainer>
                      <HeatmapGrid>
                        {heatmap.map((cell, i) => (
                          <HeatmapCell 
                            key={i} 
                            $level={cell.level} 
                            title={`${cell.date}: ${cell.count} submissions`} 
                          />
                        ))}
                      </HeatmapGrid>
                    </HeatmapContainer>
                  </div>

                  {/* --- TOPICS --- */}
                  <div>
                    <SectionTitle>&gt; TOP_TOPICS.SYS</SectionTitle>
                    <TopicsGrid>
                      {topics.map((t, i) => (
                        <TopicPill key={i}>
                          <span>{t.tagName}</span>
                          <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{t.problemsSolved}</span>
                        </TopicPill>
                      ))}
                    </TopicsGrid>
                  </div>

                </>
              )}

            </MainframeData>
          </Panel>
        </WindowContent>
      </Window>
    </Draggable>
  );
}