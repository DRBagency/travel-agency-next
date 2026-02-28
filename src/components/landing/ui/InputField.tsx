"use client";

import { ReactNode, CSSProperties, ChangeEvent } from "react";
import { useLandingTheme } from "../LandingThemeProvider";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  children?: ReactNode;
  style?: CSSProperties;
}

export function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  children,
  style: extraStyle,
}: InputFieldProps) {
  const T = useLandingTheme();

  const fieldStyle: CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: `1.5px solid ${T.border}`,
    background: T.bg,
    color: T.text,
    fontSize: 15,
    fontFamily: "var(--font-dm), DM Sans, sans-serif",
    outline: "none",
  };

  return (
    <div style={{ marginBottom: 16, ...extraStyle }}>
      <label
        style={{
          fontFamily: "var(--font-dm), DM Sans, sans-serif",
          fontSize: 13,
          color: T.sub,
          display: "block",
          marginBottom: 6,
          fontWeight: 600,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </label>
      {type === "select" ? (
        <select value={value} onChange={onChange} style={fieldStyle} data-glass-skip>
          {children}
        </select>
      ) : (
        <input
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={fieldStyle}
          data-glass-skip
        />
      )}
    </div>
  );
}
