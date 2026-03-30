"use client";

import React, { useState } from "react";
import styled, { createGlobalStyle, css } from "styled-components";

// --- Win95 Design Tokens ---
const WIN95 = {
  gray: "#c0c0c0",
  darkGray: "#808080",
  white: "#ffffff",
  black: "#000000",
  highlight: "#000080",
  highlightText: "#ffffff",
  font: "'ms_sans_serif', 'Microsoft Sans Serif', 'Segoe UI', Tahoma, sans-serif",
  fontSize: "11px",
};

// --- Global Font ---
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('https://unpkg.com/98.css@0.1.18/dist/ms_sans_serif.woff2') format('woff2');
    font-weight: normal;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('https://unpkg.com/98.css@0.1.18/dist/ms_sans_serif_bold.woff2') format('woff2');
    font-weight: bold;
  }
`;

// --- Win95 Bevel Mixin ---
const raisedBevel = css`
  border-top: 2px solid ${WIN95.white};
  border-left: 2px solid ${WIN95.white};
  border-right: 2px solid ${WIN95.black};
  border-bottom: 2px solid ${WIN95.black};
  box-shadow: inset -1px -1px 0 ${WIN95.darkGray}, inset 1px 1px 0 ${WIN95.white};
`;

// --- Styled Components ---

const StartMenuWrapper = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  z-index: 10000;
  display: flex;
  ${raisedBevel}
  background: ${WIN95.gray};
  font-family: ${WIN95.font};
  font-size: ${WIN95.fontSize};
  min-width: 0;
  user-select: none;
`;

const StartBanner = styled.div`
  background: linear-gradient(to top, #000080 0%, #1084d0 100%);
  width: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  padding-top: 6px;
`;

const BannerText = styled.span`
  color: ${WIN95.white};
  font-family: ${WIN95.font};
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 2px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
  line-height: 1;

  em {
    font-style: normal;
    color: #d4d4d4;
    font-weight: normal;
  }
`;

const MenuBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2px;
  min-width: 200px;
`;

const MenuDivider = styled.div`
  height: 0;
  border-top: 1px solid ${WIN95.darkGray};
  border-bottom: 1px solid ${WIN95.white};
  margin: 3px 4px;
`;

interface MenuItemRowProps {
  $active?: boolean;
  $disabled?: boolean;
}

const MenuItemRow = styled.div<MenuItemRowProps>`
  display: flex;
  align-items: center;
  padding: 3px 4px 3px 4px;
  cursor: default;
  white-space: nowrap;
  color: ${({ $disabled }) => ($disabled ? WIN95.darkGray : WIN95.black)};
  background: ${({ $active }) => ($active ? WIN95.highlight : "transparent")};
  color: ${({ $active, $disabled }) =>
    $active ? WIN95.highlightText : $disabled ? WIN95.darkGray : WIN95.black};
  position: relative;

  &:hover {
    background: ${({ $disabled }) => ($disabled ? "transparent" : WIN95.highlight)};
    color: ${({ $disabled }) => ($disabled ? WIN95.darkGray : WIN95.highlightText)};
  }
`;

const ItemIconWrapper = styled.span`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 8px;
  font-size: 18px;
  line-height: 1;
`;

const ItemLabel = styled.span`
  flex: 1;
  font-size: ${WIN95.fontSize};
  line-height: 1.3;
`;

const ArrowIndicator = styled.span`
  font-size: 8px;
  margin-left: 10px;
  flex-shrink: 0;
  opacity: 0.85;
`;

const SubMenuWrapper = styled.div`
  position: absolute;
  left: calc(100% - 2px);
  top: -2px;
  z-index: 10001;
  background: ${WIN95.gray};
  ${raisedBevel}
  min-width: 170px;
  padding: 2px;
`;

// --- Interfaces ---

interface StartMenuProps {
  onLaunch: (appId: string) => void;
  onShutDown: () => void;
  onRestart: () => void;
}

// --- Sub Menu Item (inner) ---
interface SubItemProps {
  icon: string;
  label: string;
  onClick: () => void;
}
function SubItem({ icon, label, onClick }: SubItemProps) {
  return (
    <MenuItemRow onClick={onClick}>
      <ItemIconWrapper style={{ fontSize: "16px", width: 22, height: 22 }}>
        {icon}
      </ItemIconWrapper>
      <ItemLabel>{label}</ItemLabel>
    </MenuItemRow>
  );
}

// --- Top-Level Item with optional submenu ---
interface TopItemProps {
  icon: string;
  label: string;
  shortcut?: string;
  arrow?: boolean;
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
}
function TopItem({
  icon,
  label,
  shortcut,
  arrow,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
  children,
}: TopItemProps) {
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MenuItemRow $active={isActive} onClick={onClick}>
        <ItemIconWrapper>{icon}</ItemIconWrapper>
        <ItemLabel>
          {/* Render underline hint for the shortcut key */}
          {shortcut
            ? renderWithUnderline(label, shortcut)
            : label}
        </ItemLabel>
        {arrow && <ArrowIndicator>▶</ArrowIndicator>}
      </MenuItemRow>
      {isActive && children && (
        <SubMenuWrapper>{children}</SubMenuWrapper>
      )}
    </div>
  );
}

/** Renders a label with one letter underlined (Windows accelerator key style) */
function renderWithUnderline(label: string, key: string) {
  const idx = label.toLowerCase().indexOf(key.toLowerCase());
  if (idx === -1) return <>{label}</>;
  return (
    <>
      {label.slice(0, idx)}
      <u>{label[idx]}</u>
      {label.slice(idx + 1)}
    </>
  );
}

// --- Main Component ---

export default function StartMenu({ onLaunch, onShutDown, onRestart }: StartMenuProps) {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const handleEnter = (id: string) => setActiveSubMenu(id);
  const handleLeave = () => setActiveSubMenu(null);

  return (
    <>
      <GlobalStyle />
      <StartMenuWrapper onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <StartBanner>
          <BannerText>
            <em>Portfolio</em> 95
          </BannerText>
        </StartBanner>

        {/* Menu Items */}
        <MenuBody>
          {/* Programs */}
          <TopItem
            icon="📁"
            label="Programs"
            shortcut="p"
            arrow
            isActive={activeSubMenu === "programs"}
            onMouseEnter={() => handleEnter("programs")}
            onMouseLeave={handleLeave}
          >
            <SubItem icon="🌐" label="Internet Explorer" onClick={() => onLaunch("internet")} />
            <SubItem icon="💻" label="MS-DOS Prompt"     onClick={() => onLaunch("terminal")} />
            <SubItem icon="💣" label="Minesweeper"        onClick={() => onLaunch("minesweeper")} />
            <SubItem icon="📂" label="Projects"           onClick={() => onLaunch("projects")} />
            <SubItem icon="🕰️" label="Clock"              onClick={() => onLaunch("clock")} />
          </TopItem>

          {/* Documents */}
          <TopItem
            icon="📄"
            label="Documents"
            shortcut="d"
            arrow
            isActive={activeSubMenu === "documents"}
            onMouseEnter={() => handleEnter("documents")}
            onMouseLeave={handleLeave}
          >
            <SubItem icon="📝" label="resume.pdf" onClick={() => onLaunch("resume")} />
          </TopItem>

          {/* Settings */}
          <TopItem
            icon="⚙️"
            label="Settings"
            shortcut="s"
            onClick={() => onLaunch("settings")}
            onMouseEnter={() => handleEnter("settings")}
            onMouseLeave={handleLeave}
          />

          <MenuDivider />

          {/* Restart */}
          <TopItem
            icon="🔄"
            label="Restart..."
            shortcut="r"
            onClick={onRestart}
            onMouseEnter={() => handleEnter("restart")}
            onMouseLeave={handleLeave}
          />

          {/* Shut Down */}
          <TopItem
            icon="🔌"
            label="Shut Down..."
            shortcut="u"
            onClick={onShutDown}
            onMouseEnter={() => handleEnter("shutdown")}
            onMouseLeave={handleLeave}
          />
        </MenuBody>
      </StartMenuWrapper>
    </>
  );
}