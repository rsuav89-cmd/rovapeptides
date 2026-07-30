import { ImageResponse } from "next/og";
import React from "react";

// Favicon — rendered dynamically so no binary asset needs to be checked in.
// Next.js picks this up automatically via the app/icon.tsx file convention.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
                                  borderRadius: 6,
                      },
            },
                  React.createElement(
                            "span",
                    {
                                style: {
                                              color: "#B76E59",
                                              fontSize: 20,
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
