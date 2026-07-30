import { ImageResponse } from "next/og";
import React from "react";

// Apple touch icon — rendered dynamically via the app/apple-icon.tsx file convention.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
          React.createElement(
                  "div",
            {
                      style: {
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "#000000",
                      },
            },
                  React.createElement(
                            "span",
                    {
                                style: {
                                              color: "#B76E59",
                                              fontSize: 96,
                                              fontWeight: 700,
                                              fontFamily: "sans-serif",
                                },
                    },
                            "R"
                          )
                ),
      { ...size }
        );
}
