"use client";

import React, { useRef } from 'react';
import {
  Window,
  WindowHeader,
  WindowContent,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  TableDataCell,
  Anchor,
  Button,
  Toolbar
} from 'react95';
import styled from 'styled-components';
import Draggable from 'react-draggable';

// --- Styled Components ---

const StyledWindow = styled(Window)`
  width: 550px;
  max-width: 95vw;
  position: absolute;
  z-index: 10;
`;

const TechBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  margin-right: 4px;
  margin-bottom: 2px;
  border-top: 1px solid ${({ theme }: any) => theme.borderDarkest};
  border-left: 1px solid ${({ theme }: any) => theme.borderDarkest};
  border-bottom: 1px solid ${({ theme }: any) => theme.borderLightest};
  border-right: 1px solid ${({ theme }: any) => theme.borderLightest};
  background: ${({ theme }: any) => theme.canvas};
  color: ${({ theme }: any) => theme.canvasText};
  font-size: 10px;
  font-weight: bold;
`;

// --- Data ---

const projectsData = [
  {
    name: 'DocChat RAG',
    stack: ['Langchain', 'Express.js', 'React'],
    url: 'https://docqna.sudhanshucodes.me/',
    icon: '📄'
  },
  {
    name: 'Termi-Chat',
    stack: ['Socket.io'],
    url: 'https://github.com/Sudhanshu5669/Termi-Chat',
    icon: '👾'
  },
  {
    name: 'Mind Space',
    stack: ['Node', 'Docker', 'Python'],
    url: 'https://github.com/Sudhanshu5669/Mind-Space',
    icon: '🧠'
  },
  {
    name: 'Windows styled Portfolio',
    stack: ['Next.js', 'React', 'TypeScript'],
    url: 'https://github.com/Sudhanshu5669/Windows-styled-Portfolio',
    icon: '🪟'
  }
];

// --- Component ---

interface ProjectsProps {
  onClose: () => void;
}

const Projects = ({ onClose }: ProjectsProps) => {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header">
      <div ref={nodeRef} style={{ position: 'absolute', top: '15%', left: '15%' }}>
        <StyledWindow>
          <WindowHeader className="window-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📁 My_Projects.exe</span>
            </div>
            <Button size="sm" square onClick={onClose}>
              <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>x</span>
            </Button>
          </WindowHeader>

          <Toolbar>
            <Button variant="menu" size="sm">View</Button>
            <Button variant="menu" size="sm">Sort</Button>
            <Button variant="menu" size="sm" onClick={() => window.open('https://github.com/Sudhanshu5669', '_blank')}>
              GitHub_Profile
            </Button>
          </Toolbar>

          <WindowContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell style={{ width: '40px' }}>Type</TableHeadCell>
                  <TableHeadCell>Filename</TableHeadCell>
                  <TableHeadCell>Dependencies</TableHeadCell>
                  <TableHeadCell style={{ width: '80px' }}>Action</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectsData.map((project) => (
                  <TableRow key={project.name}>
                    <TableDataCell style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                      {project.icon}
                    </TableDataCell>
                    <TableDataCell style={{ fontWeight: 'bold' }}>
                      {project.name}
                    </TableDataCell>
                    <TableDataCell>
                      {project.stack.map(s => <TechBadge key={s}>{s}</TechBadge>)}
                    </TableDataCell>
                    <TableDataCell>
                      <Anchor href={project.url} target="_blank">
                        Open
                      </Anchor>
                    </TableDataCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </WindowContent>
        </StyledWindow>
      </div>
    </Draggable>
  );
};

export default Projects;