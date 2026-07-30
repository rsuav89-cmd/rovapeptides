import { ImageResponse } from "next/og";
import React from "react";

// Social share image — rendered dynamically via the app/opengraph-image.tsx file
// convention. Next.js auto-injects the og:image / twitter:image tags, so links shared
// on iMessage, WhatsApp, Twitter, etc. show this high-res brand card instead of a blank box.
export const alt = "RovaPeptides — Research-Grade Peptides, Verified to the Batch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
          React.createElement(
                  "div",
            {
                      style: {
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  padding: "80px",
                                  background: "#000000",
                                  fontFamily: "sans-serif",
                      },
            },
                  React.createElement(
                            "span",
                    {
                                style: {
                                              color: "#B76E59",
                                              fontSize: 22,
                                              fontWeight: 700,
                                              letterSpacing: 6,
                                              textTransform: "uppercase",
                                },
                    },
                            "Research-Grade Peptides"
                          ),
                  React.createElement(
                            "span",
                    {
                                style: {
                                              marginTop: 24,
                                              display: "flex",
                                              color: "#FFFFFF",
                                              fontSize: 96,
                                              fontWeight: 700,
                                              letterSpacing: -2,
                                },
                    },
                            "Rova",
                            React.createElement("span", { style: { color: "#B76E59" } }, "Peptides")
                          ),
                  React.createElement(
                            "span",
                    {
                                style: {
                                              marginTop: 28,
                                              color: "#B7B7C0",
                                              fontSize: 30,
                                },
                    },
                            "Verified to the batch — 99%+ purity, third-party COAs on every batch."
                          )
                ),
      { ...size }
        );
}
