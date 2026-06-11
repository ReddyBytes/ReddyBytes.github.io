/**
 * SkillsMap — React Flow neural map of skills.
 *
 * Per docs/design/LAYER3-SKILLS.md:
 *   - Python at center, ~10 techs in 3 category clusters arranged 120° apart
 *   - Spawn-from-center animation on first render (or instant if reduced-motion)
 *   - Drag/zoom/pan via React Flow built-ins
 *   - Edges: center→all + custom `connects` from frontmatter
 *   - Reset button restores radial layout
 *
 * Client component — uses ResizeObserver + Framer Motion + browser APIs.
 * Lazy-loaded from the page via next/dynamic to keep bundle off other routes.
 */
"use client";

import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo, useRef } from "react";

import { SkillNode, type SkillNodeData } from "@/components/layer3/skills/SkillNode";
import { SkillsLegend } from "@/components/layer3/skills/SkillsLegend";
import { useReducedMotion } from "@/lib/motion/reducedMotion";
import type { SkillEnriched } from "@/lib/content/skills-schema";

interface SkillsMapProps {
  techs: SkillEnriched[];
}

const nodeTypes: NodeTypes = { skill: SkillNode };

/** Layout: center at (0,0), non-center techs radiate by category. */
function computeLayout(techs: SkillEnriched[]): Node[] {
  const center = techs.find((t) => t.isCenter);
  const others = techs.filter((t) => !t.isCenter);

  const nodes: Node[] = [];

  if (center) {
    nodes.push({
      id: center.slug,
      type: "skill",
      position: { x: 0, y: 0 },
      data: { skill: center } satisfies SkillNodeData,
      draggable: true,
    });
  }

  // Group by category
  const byCat: Record<string, SkillEnriched[]> = {
    language: [],
    systems: [],
    ai: [],
  };
  others.forEach((t) => byCat[t.category]?.push(t));

  // Category cluster centers (positioned 120° apart around Python)
  const RADIUS = 260;
  const clusterAngles: Record<string, number> = {
    language: -Math.PI / 2,    // top (12 o'clock)
    systems: Math.PI * 0.83,   // bottom-left (~7:30)
    ai: Math.PI * 0.17,        // bottom-right (~4:30)
  };

  for (const [cat, items] of Object.entries(byCat)) {
    const clusterAngle = clusterAngles[cat] ?? 0;
    const clusterCx = Math.cos(clusterAngle) * RADIUS;
    const clusterCy = Math.sin(clusterAngle) * RADIUS;

    // Spread items in an arc around the cluster center
    const SUB_RADIUS = 110;
    items.forEach((tech, i) => {
      const spreadAngle = clusterAngle + ((i - (items.length - 1) / 2) * 0.65);
      nodes.push({
        id: tech.slug,
        type: "skill",
        position: {
          x: clusterCx + Math.cos(spreadAngle) * SUB_RADIUS,
          y: clusterCy + Math.sin(spreadAngle) * SUB_RADIUS,
        },
        data: { skill: tech } satisfies SkillNodeData,
        draggable: true,
      });
    });
  }

  return nodes;
}

function computeEdges(techs: SkillEnriched[]): Edge[] {
  const center = techs.find((t) => t.isCenter);
  if (!center) return [];

  const edges: Edge[] = [];
  const seen = new Set<string>();

  // Auto-edge: center → every non-center tech
  techs
    .filter((t) => !t.isCenter)
    .forEach((t) => {
      const id = `${center.slug}-${t.slug}`;
      edges.push({
        id,
        source: center.slug,
        target: t.slug,
        animated: false,
        style: { stroke: "rgba(255,255,255,0.10)", strokeWidth: 1 },
      });
      seen.add(`${center.slug}-${t.slug}`);
      seen.add(`${t.slug}-${center.slug}`);
    });

  // Custom edges via tech.connects[]
  techs.forEach((t) => {
    t.connects.forEach((targetSlug) => {
      const key = `${t.slug}-${targetSlug}`;
      const reverseKey = `${targetSlug}-${t.slug}`;
      if (seen.has(key) || seen.has(reverseKey)) return;
      edges.push({
        id: key,
        source: t.slug,
        target: targetSlug,
        animated: false,
        style: { stroke: "rgba(168, 85, 247, 0.18)", strokeWidth: 1 },
      });
      seen.add(key);
      seen.add(reverseKey);
    });
  });

  return edges;
}

function MapInner({ techs }: SkillsMapProps) {
  const reducedMotion = useReducedMotion();
  const initialLayout = useMemo(() => computeLayout(techs), [techs]);
  const initialEdges = useMemo(() => computeEdges(techs), [techs]);

  // For the spawn animation, start every non-center node at (0,0) and animate
  // to its computed position. If reduced-motion: skip the spawn animation.
  const startingNodes = useMemo<Node[]>(() => {
    if (reducedMotion) return initialLayout;
    return initialLayout.map((n) => ({
      ...n,
      position: { x: 0, y: 0 },
    }));
  }, [initialLayout, reducedMotion]);

  const [nodes, setNodes, onNodesChange] = useNodesState(startingNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();
  const fittedRef = useRef(false);

  // Spawn animation: after first paint, animate to target positions
  useEffect(() => {
    if (reducedMotion) {
      fitView({ padding: 0.2, duration: 0 });
      return;
    }

    const t = setTimeout(() => {
      setNodes((current) =>
        current.map((n) => {
          const target = initialLayout.find((tn) => tn.id === n.id);
          return target ? { ...n, position: target.position } : n;
        }),
      );
      // After spawn settles, fit view
      setTimeout(() => {
        if (!fittedRef.current) {
          fitView({ padding: 0.2, duration: 600 });
          fittedRef.current = true;
        }
      }, 900);
    }, 60);

    return () => clearTimeout(t);
  }, [initialLayout, reducedMotion, setNodes, fitView]);

  // Apply CSS transition for the spawn fly-out (only when motion enabled)
  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div
      className="relative h-[70vh] w-full overflow-hidden rounded-lg border border-border-subtle"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0f0f24 0%, #08081a 70%)",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        proOptions={proOptions}
        minZoom={0.4}
        maxZoom={2}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        panOnScroll={false}
        zoomOnScroll
        fitViewOptions={{ padding: 0.2 }}
        style={
          {
            ["--xy-node-transition" as string]: reducedMotion
              ? "none"
              : "transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          } as React.CSSProperties
        }
      >
        <Background gap={32} color="rgba(255,255,255,0.05)" />
        <Controls
          showInteractive={false}
          position="bottom-left"
          className="!rounded-md !border !border-border-subtle !bg-bg-elevated"
        />
      </ReactFlow>
      <SkillsLegend />
    </div>
  );
}

export function SkillsMap({ techs }: SkillsMapProps) {
  return (
    <ReactFlowProvider>
      <MapInner techs={techs} />
    </ReactFlowProvider>
  );
}
