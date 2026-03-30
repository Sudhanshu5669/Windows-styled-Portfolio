"use client";

import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "portfolio95-fullscreen-prompted";

const C = {
  gray:      "#c0c0c0",
  white:     "#ffffff",
  black:     "#000000",
  darkGray:  "#808080",
  navy:      "#000080",
  navyLight: "#1084d0",
  canvas:    "#ffffff",
  text:      "#000000",
  font:      "'ms_sans_serif', 'Microsoft Sans Serif', Tahoma, sans-serif",
};

// ─── Fullscreen helpers ───────────────────────────────────────────────────────

function supportsFullscreen() {
  return !!(
    document.documentElement.requestFullscreen ||
    (document.documentElement as any).webkitRequestFullscreen
  );
}

async function requestFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) return el.requestFullscreen();
  if ((el as any).webkitRequestFullscreen) return (el as any).webkitRequestFullscreen();
}

// ─── Bevel mixins ─────────────────────────────────────────────────────────────

const raised = css`
  border-top:    2px solid ${C.white};
  border-left:   2px solid ${C.white};
  border-right:  2px solid ${C.black};
  border-bottom: 2px solid ${C.black};
  box-shadow: inset -1px -1px 0 ${C.darkGray}, inset 1px 1px 0 ${C.white};
`;

const sunken = css`
  border-top:    2px solid ${C.black};
  border-left:   2px solid ${C.black};
  border-right:  2px solid ${C.white};
  border-bottom: 2px solid ${C.white};
  box-shadow: inset 1px 1px 0 ${C.darkGray}, inset -1px -1px 0 ${C.white};
`;

// ─── Animation ────────────────────────────────────────────────────────────────

const popIn = keyframes`
  from { transform: translate(-50%, -48%) scale(0.96); opacity: 0; }
  to   { transform: translate(-50%, -50%) scale(1);    opacity: 1; }
`;

// ─── Styled components ────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #008080;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.04) 0px,
    rgba(0,0,0,0.04) 1px,
    transparent 1px,
    transparent 3px
  );
  z-index: 99999;
`;

const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  max-width: calc(100vw - 32px);
  background: ${C.gray};
  font-family: ${C.font};
  font-size: 11px;
  ${raised}
  animation: ${popIn} 120ms ease-out both;
  z-index: 100000;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 4px 3px 6px;
  background: linear-gradient(to right, ${C.navy}, ${C.navyLight});
  color: ${C.white};
  user-select: none;
`;

const TitleText = styled.span`
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1;
`;

const CloseBtn = styled.button`
  width: 16px;
  height: 14px;
  padding: 0;
  background: ${C.gray};
  ${raised}
  font-size: 9px;
  font-family: ${C.font};
  line-height: 1;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${C.text};

  &:active { ${sunken} }
`;

const Body = styled.div`
  padding: 16px 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const MessageRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const BigIcon = styled.div`
  font-size: 36px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
`;

const MessageText = styled.div`
  font-size: 11px;
  color: ${C.text};
  line-height: 1.7;

  strong { font-weight: bold; }
`;

const InfoBox = styled.div`
  ${sunken}
  background: ${C.canvas};
  padding: 8px 10px;
  font-size: 11px;
  color: ${C.text};
  line-height: 1.6;
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${C.text};
  cursor: default;
  user-select: none;
`;

const Checkbox = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  background: ${C.canvas};
  ${sunken}
  cursor: default;
  position: relative;

  &:checked::after {
    content: "✔";
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: ${C.text};
    line-height: 13px;
    padding-left: 1px;
  }
`;

const Divider = styled.div`
  height: 0;
  border-top:    1px solid ${C.darkGray};
  border-bottom: 1px solid ${C.white};
  margin: 0 -20px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 2px;
`;

const Win95Btn = styled.button<{ $primary?: boolean }>`
  min-width: 88px;
  height: 23px;
  padding: 0 12px;
  background: ${C.gray};
  ${raised}
  font-family: ${C.font};
  font-size: 11px;
  color: ${C.text};
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  outline: ${({ $primary }) => ($primary ? `1px dotted ${C.black}` : "none")};
  outline-offset: -4px;

  &:active {
    ${sunken}
    padding-top: 1px;
    padding-left: 13px;
  }

  &:focus-visible {
    outline: 1px dotted ${C.black};
    outline-offset: -4px;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

interface FullscreenPromptProps {
  onClose?: () => void;
}

export default function FullscreenPrompt({ onClose }: FullscreenPromptProps) {
  const [visible, setVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const alreadyPrompted   = localStorage.getItem(STORAGE_KEY) === "1";
    const alreadyFullscreen = !!document.fullscreenElement;
    if (!alreadyPrompted && !alreadyFullscreen && supportsFullscreen()) {
      setVisible(true);
    }
  }, []);

  const dismiss = useCallback((remember: boolean) => {
    setVisible(false);
    if (remember) {
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    }
    onClose?.();
  }, [onClose]);

  const handleYes = useCallback(async () => {
    try { await requestFullscreen(); } catch {}
    dismiss(dontShowAgain);
  }, [dontShowAgain, dismiss]);

  const handleNo = useCallback(() => {
    dismiss(dontShowAgain);
  }, [dontShowAgain, dismiss]);

  if (!visible) return null;

  return (
    <Overlay>
      <Dialog role="dialog" aria-modal aria-labelledby="fs-title">

        <TitleBar>
          <TitleText id="fs-title">
            🖥️ Display Settings
          </TitleText>
          <CloseBtn onClick={handleNo} title="Close" aria-label="Close">✕</CloseBtn>
        </TitleBar>

        <Body>
          <MessageRow>
            <BigIcon>⚠️</BigIcon>
            <MessageText>
              <strong>This program works best in full screen mode.</strong>
              <br /><br />
              For the optimal Portfolio 95 experience, it is recommended
              that you switch to full screen now.
            </MessageText>
          </MessageRow>

          <InfoBox>
            💡 <strong>Tip:</strong> You can exit full screen at any time
            by pressing <strong>F11</strong> or <strong>Esc</strong>.
          </InfoBox>

          <CheckRow>
            <Checkbox
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            Don&apos;t show this message again
          </CheckRow>

          <Divider />

          <ButtonRow>
            <Win95Btn $primary onClick={handleYes} autoFocus>
              ✔&nbsp; Yes
            </Win95Btn>
            <Win95Btn onClick={handleNo}>
              ✕&nbsp; No
            </Win95Btn>
          </ButtonRow>
        </Body>

      </Dialog>
    </Overlay>
  );
}