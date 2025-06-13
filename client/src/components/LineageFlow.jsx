// import React, { useCallback, useRef } from 'react';
// import ReactFlow, {
//   Background,
//   Controls,
//   useNodesState,
//   useEdgesState,
// } from 'react-flow-renderer';
// import clsx from 'classnames';

// const miracleColors = {
//   source: 'bg-miracle-lightBlue',
//   loadType: 'bg-miracle-mediumBlue',
//   pipeline: 'bg-miracle-red',
//   tableCount: 'bg-miracle-darkGrey',
//   table: 'bg-miracle-black',
//   destination: 'bg-miracle-lightBlue',
// };

// const getId = (() => {
//   let id = 0;
//   return () => `node_${id++}`;
// })();

// const createNode = (label, type, position, data = {}) => ({
//   id: getId(),
//   type: 'default',
//   position,
//   sourcePosition: 'right',
//   targetPosition: 'left',
//   data: {
//     label: (
//       <div title={type}>
//         {label}
//       </div>
//     ),
//     labelRaw: label,
//     title: type,
//     ...data,
//   },
//   className: clsx(
//     'text-white px-3 py-2 rounded shadow transition-all duration-300',
//     miracleColors[type],
//     'w-auto max-w-[300px] inline-block whitespace-normal break-words'
//   ),
// });

// const recursivelyRemoveChildren = (parentId, allNodes, allEdges) => {
//   const childNodes = allNodes.filter(n => n.data?.parent === parentId);
//   let updatedNodes = allNodes.filter(n => n.data?.parent !== parentId);
//   let updatedEdges = allEdges.filter(e => e.source !== parentId);

//   for (const child of childNodes) {
//     const result = recursivelyRemoveChildren(child.id, updatedNodes, updatedEdges);
//     updatedNodes = result.nodes;
//     updatedEdges = result.edges;
//   }

//   return { nodes: updatedNodes, edges: updatedEdges };
// };

// const collapseSiblings = (currentNode, allNodes, allEdges, expandedMapRef) => {
//   const parentId = currentNode.data.parent;
//   const siblingNodes = allNodes.filter(
//     n => n.data.parent === parentId && n.id !== currentNode.id
//   );

//   let updatedNodes = [...allNodes];
//   let updatedEdges = [...allEdges];

//   siblingNodes.forEach(sibling => {
//     if (expandedMapRef.current.get(sibling.id)) {
//       expandedMapRef.current.set(sibling.id, false);
//       const result = recursivelyRemoveChildren(sibling.id, updatedNodes, updatedEdges);
//       updatedNodes = result.nodes;
//       updatedEdges = result.edges;
//     }
//   });

//   return { nodes: updatedNodes, edges: updatedEdges };
// };

// const LineageFlow = ({ lineageData }) => {
//   const initialNodes = [
//     createNode('Data Source', 'source', { x: 100, y: 100 }, { type: 'root' }),
//   ];
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const expandedMap = useRef(new Map());

//   const toggleExpansion = (nodeId) => {
//     const isExpanded = expandedMap.current.get(nodeId);
//     expandedMap.current.set(nodeId, !isExpanded);
//     return !isExpanded;
//   };

//   const onNodeClick = useCallback(
//     (e, node) => {
//       const { labelRaw, type } = node.data;
//       const nodeId = node.id;

//       const isExpanding = toggleExpansion(nodeId);
//       if (!isExpanding) {
//         const result = recursivelyRemoveChildren(nodeId, nodes, edges);
//         setNodes(result.nodes);
//         setEdges(result.edges);
//         return;
//       } else {
//         const result = collapseSiblings(node, nodes, edges, expandedMap);
//         setNodes(result.nodes);
//         setEdges(result.edges);
//       }

//       if (labelRaw === 'Data Source') {
//         const newNodes = lineageData.map((entry, i) =>
//           createNode(entry.source, 'source', {
//             x: node.position.x + 250,
//             y: 100 + i * 100,
//           }, { type: 'source', parent: nodeId })
//         );

//         const newEdges = newNodes.map(n => ({
//           id: `e${nodeId}-${n.id}`,
//           source: nodeId,
//           target: n.id,
//           animated: true,
//         }));

//         setNodes(nds => [...nds, ...newNodes]);
//         setEdges(eds => [...eds, ...newEdges]);
//       }

//       if (type === 'source') {
//         const sourceData = lineageData.find(d => d.source === labelRaw);
//         if (!sourceData) return;

//         const newNodes = sourceData.Load_types.map((lt, i) =>
//           createNode(lt, 'loadType', {
//             x: node.position.x + 250,
//             y: node.position.y + i * 120,
//           }, { type: 'loadType', source: labelRaw, parent: nodeId })
//         );

//         const newEdges = newNodes.map(n => ({
//           id: `e${nodeId}-${n.id}`,
//           source: nodeId,
//           target: n.id,
//           animated: true,
//         }));

//         setNodes(nds => [...nds, ...newNodes]);
//         setEdges(eds => [...eds, ...newEdges]);
//       }

//       if (type === 'loadType') {
//         const { source } = node.data;
//         const sourceData = lineageData.find(d => d.source === source);
//         const detail = sourceData?.Load_Type_Details.find(d => d.Load_type === labelRaw);
//         if (!detail) return;

//         const newNodes = detail.ETL_Pipeline.map((pipeline, i) =>
//           createNode(pipeline, 'pipeline', {
//             x: node.position.x + 250,
//             y: node.position.y + i * 100,
//           }, {
//             type: 'pipeline',
//             source,
//             loadType: labelRaw,
//             pipelineIndex: i,
//             parent: nodeId,
//           })
//         );

//         const newEdges = newNodes.map(n => ({
//           id: `e${nodeId}-${n.id}`,
//           source: nodeId,
//           target: n.id,
//           animated: true,
//         }));

//         setNodes(nds => [...nds, ...newNodes]);
//         setEdges(eds => [...eds, ...newEdges]);
//       }

//       if (type === 'pipeline') {
//         const { source, loadType, pipelineIndex } = node.data;
//         const sourceData = lineageData.find(d => d.source === source);
//         const detail = sourceData?.Load_Type_Details.find(d => d.Load_type === loadType);
//         if (!detail) return;

//         const count = detail.Total_Tables[pipelineIndex];
//         const countLabel = `${count} Tables`;
//         const countNode = createNode(countLabel, 'tableCount', {
//           x: node.position.x + 250,
//           y: node.position.y,
//         }, {
//           type: 'tableCount',
//           source,
//           loadType,
//           pipelineIndex,
//           parent: nodeId,
//         });

//         setNodes(nds => [...nds, countNode]);
//         setEdges(eds => [...eds, {
//           id: `e${nodeId}-${countNode.id}`,
//           source: nodeId,
//           target: countNode.id,
//           animated: true,
//         }]);
//       }

//       if (type === 'tableCount') {
//         const { source, loadType, pipelineIndex } = node.data;
//         const sourceData = lineageData.find(d => d.source === source);
//         const detail = sourceData?.Load_Type_Details.find(d => d.Load_type === loadType);
//         const rawTables = detail?.Destination_Tables[pipelineIndex];
//         const tables = rawTables?.split(',').map(t => t.trim()) || [];

//         const newNodes = tables.map((table, i) =>
//           createNode(table, 'table', {
//             x: node.position.x + 250,
//             y: node.position.y + i * 80,
//           }, {
//             type: 'table',
//             source,
//             table,
//             parent: nodeId,
//           })
//         );

//         const newEdges = newNodes.map(n => ({
//           id: `e${nodeId}-${n.id}`,
//           source: nodeId,
//           target: n.id,
//           animated: true,
//         }));

//         setNodes(nds => [...nds, ...newNodes]);
//         setEdges(eds => [...eds, ...newEdges]);
//       }

//       if (type === 'table') {
//         const destinationNode = createNode('Fabric Lakehouse', 'destination', {
//           x: node.position.x + 250,
//           y: node.position.y,
//         }, {
//           type: 'destination',
//           parent: nodeId,
//         });

//         setNodes(nds => [...nds, destinationNode]);
//         setEdges(eds => [...eds, {
//           id: `e${nodeId}-${destinationNode.id}`,
//           source: nodeId,
//           target: destinationNode.id,
//           animated: true,
//         }]);
//       }
//     },
//     [lineageData, nodes, edges, setNodes, setEdges]
//   );

//   return (
//     <div className="h-[77vh] w-full bg-white rounded-lg shadow-md">
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onNodeClick={onNodeClick}
//         fitView
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// };

// export default LineageFlow;

// _________________________________________________________________________

// // for harish data
// import React, { useCallback, useRef } from 'react';
// import ReactFlow, {
//   Background,
//   Controls,
//   useNodesState,
//   useEdgesState,
// } from 'react-flow-renderer';
// import clsx from 'classnames';

// const miracleColors = {
//   source: 'bg-miracle-lightBlue',
//   loadType: 'bg-miracle-mediumBlue',
//   pipeline: 'bg-miracle-red',
//   tableCount: 'bg-miracle-darkGrey',
//   table: 'bg-miracle-black',
//   destination: 'bg-miracle-lightBlue',
// };

// const getId = (() => {
//   let id = 0;
//   return () => `node_${id++}`;
// })();

// const createNode = (label, type, position, data = {}) => ({
//   id: getId(),
//   type: 'default',
//   position,
//   sourcePosition: 'right',
//   targetPosition: 'left',
//   data: {
//     label: (
//       <div title={type}>{label}</div>
//     ),
//     labelRaw: label,
//     title: type,
//     ...data,
//   },
//   className: clsx(
//     'text-white px-3 py-2 rounded shadow transition-all duration-300',
//     miracleColors[type],
//     'w-auto max-w-[300px] inline-block whitespace-normal break-words'
//   ),
// });

// const recursivelyRemoveChildren = (parentId, allNodes, allEdges) => {
//   const childNodes = allNodes.filter(n => n.data?.parent === parentId);
//   let updatedNodes = allNodes.filter(n => n.data?.parent !== parentId);
//   let updatedEdges = allEdges.filter(e => e.source !== parentId);

//   childNodes.forEach(child => {
//     const result = recursivelyRemoveChildren(child.id, updatedNodes, updatedEdges);
//     updatedNodes = result.nodes;
//     updatedEdges = result.edges;
//   });

//   return { nodes: updatedNodes, edges: updatedEdges };
// };

// const collapseSiblings = (currentNode, allNodes, allEdges, expandedMapRef) => {
//   const parentId = currentNode.data.parent;
//   const siblingNodes = allNodes.filter(
//     n => n.data.parent === parentId && n.id !== currentNode.id
//   );

//   let updatedNodes = [...allNodes];
//   let updatedEdges = [...allEdges];

//   siblingNodes.forEach(sibling => {
//     if (expandedMapRef.current.get(sibling.id)) {
//       expandedMapRef.current.set(sibling.id, false);
//       const result = recursivelyRemoveChildren(sibling.id, updatedNodes, updatedEdges);
//       updatedNodes = result.nodes;
//       updatedEdges = result.edges;
//     }
//   });

//   return { nodes: updatedNodes, edges: updatedEdges };
// };

// const LineageFlow = ({ lineageData }) => {
//   // support passing either {data: [...] } or raw array
//   const rawData = Array.isArray(lineageData) ? lineageData : lineageData.data || [];

//   const initialNodes = [
//     createNode('Data Source', 'source', { x: 100, y: 100 }, { type: 'root', parent: null }),
//   ];
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const expandedMap = useRef(new Map());

//   const toggleExpansion = nodeId => {
//     const isExpanded = expandedMap.current.get(nodeId);
//     expandedMap.current.set(nodeId, !isExpanded);
//     return !isExpanded;
//   };

//   const onNodeClick = useCallback(
//     (e, node) => {
//       const { labelRaw, title: type } = node.data;
//       const nodeId = node.id;

//       const isExpanding = toggleExpansion(nodeId);
//       if (!isExpanding) {
//         const result = recursivelyRemoveChildren(nodeId, nodes, edges);
//         setNodes(result.nodes);
//         setEdges(result.edges);
//         return;
//       }

//       const collapsed = collapseSiblings(node, nodes, edges, expandedMap);
//       setNodes(collapsed.nodes);
//       setEdges(collapsed.edges);

//       // Expand logic
//       if (labelRaw === 'Data Source') {
//         const newNodes = rawData.map((entry, i) =>
//           createNode(entry.source, 'source', {
//             x: node.position.x + 250,
//             y: 100 + i * 100,
//           }, { parent: nodeId })
//         );
//         const newEdges = newNodes.map(n => ({ id: `e${nodeId}-${n.id}`, source: nodeId, target: n.id, animated: true }));
//         setNodes(nds => [...nds, ...newNodes]);
//         setEdges(eds => [...eds, ...newEdges]);
//       }

//       if (type === 'source') {
//         const sourceData = rawData.find(d => d.source === labelRaw);
//         if (!sourceData || !Array.isArray(sourceData.loadType)) return;
//         const newNodes = sourceData.loadType.map((lt, i) =>
//           createNode(lt, 'loadType', { x: node.position.x + 250, y: node.position.y + i * 120 }, { source: labelRaw, parent: nodeId })
//         );
//         const newEdges = newNodes.map(n => ({ id: `e${nodeId}-${n.id}`, source: nodeId, target: n.id, animated: true }));
//         setNodes(nds => [...nds, ...newNodes]);
//         setEdges(eds => [...eds, ...newEdges]);
//       }

//       if (type === 'loadType') {
//         const { source } = node.data;
//         const sourceData = rawData.find(d => d.source === source);
//         const detail = sourceData?.loadTypeDetails?.find(d => d.loadType === labelRaw);
//         if (!detail || !Array.isArray(detail.ETLPipeline)) return;
//         const newNodes = detail.ETLPipeline.map((pipe, i) =>
//           createNode(pipe, 'pipeline', { x: node.position.x + 250, y: node.position.y + i * 100 }, { source, loadType: labelRaw, pipelineIndex: i, parent: nodeId })
//         );
//         const newEdges = newNodes.map(n => ({ id: `e${nodeId}-${n.id}`, source: nodeId, target: n.id, animated: true }));
//         setNodes(nds => [...nds, ...newNodes]);
//         setEdges(eds => [...eds, ...newEdges]);
//       }

//       if (type === 'pipeline') {
//         const { source, loadType, pipelineIndex } = node.data;
//         const sourceData = rawData.find(d => d.source === source);
//         const detail = sourceData?.loadTypeDetails?.find(d => d.loadType === loadType);
//         const totalArr = detail?.totalDestinationTables;
//         const count = Array.isArray(totalArr) ? totalArr[pipelineIndex] : undefined;
//         if (count == null) return;
//         const countNode = createNode(`${count} Tables`, 'tableCount', { x: node.position.x + 250, y: node.position.y }, { source, loadType, pipelineIndex, parent: nodeId });
//         setNodes(nds => [...nds, countNode]);
//         setEdges(eds => [...eds, { id: `e${nodeId}-${countNode.id}`, source: nodeId, target: countNode.id, animated: true }]);
//       }

//       if (type === 'tableCount') {
//         const { source, loadType, pipelineIndex } = node.data;
//         const sourceData = rawData.find(d => d.source === source);
//         const detail = sourceData?.loadTypeDetails?.find(d => d.loadType === loadType);
//         const tablesArr = detail?.destinationTables;
//         if (!Array.isArray(tablesArr)) return;
//         const newNodes = tablesArr.map((tbl, i) =>
//           createNode(tbl, 'table', { x: node.position.x + 250, y: node.position.y + i * 80 }, { source, table: tbl, parent: nodeId })
//         );
//         const newEdges = newNodes.map(n => ({ id: `e${nodeId}-${n.id}`, source: nodeId, target: n.id, animated: true }));
//         setNodes(nds => [...nds, ...newNodes]);
//         setEdges(eds => [...eds, ...newEdges]);
//       }

//       if (type === 'table') {
//         const destNode = createNode('Fabric Lakehouse', 'destination', { x: node.position.x + 250, y: node.position.y }, { parent: nodeId });
//         setNodes(nds => [...nds, destNode]);
//         setEdges(eds => [...eds, { id: `e${nodeId}-${destNode.id}`, source: nodeId, target: destNode.id, animated: true }]);
//       }
//     },
//     [rawData, nodes, edges, setNodes, setEdges]
//   );

//   return (
//     <div className="h-[77vh] w-full bg-white rounded-lg shadow-md">
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onNodeClick={onNodeClick}
//         fitView
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// };

// export default LineageFlow;

import React, { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import clsx from "classnames";

const miracleColors = {
  source: "bg-miracle-lightBlue",
  loadType: "bg-miracle-mediumBlue",
  pipeline: "bg-miracle-red",
  tableCount: "bg-miracle-darkGrey",
  table: "bg-miracle-black",
  destination: "bg-miracle-lightBlue",
};

const getId = (() => {
  let id = 0;
  return () => `node_${id++}`;
})();

const createNode = (label, type, position, data = {}) => ({
  id: getId(),
  type: "default",
  position,
  sourcePosition: "right",
  targetPosition: "left",
  data: {
    label: <div title={type}>{label}</div>,
    labelRaw: label,
    title: type,
    ...data,
  },
  className: clsx(
    "text-white px-3 py-2 rounded shadow transition-all duration-300",
    miracleColors[type],
    "w-auto max-w-[300px] inline-block whitespace-normal break-words"
  ),
});

const recursivelyRemoveChildren = (parentId, allNodes, allEdges) => {
  const childNodes = allNodes.filter((n) => n.data?.parent === parentId);
  let updatedNodes = allNodes.filter((n) => n.data?.parent !== parentId);
  let updatedEdges = allEdges.filter((e) => e.source !== parentId);

  childNodes.forEach((child) => {
    const result = recursivelyRemoveChildren(
      child.id,
      updatedNodes,
      updatedEdges
    );
    updatedNodes = result.nodes;
    updatedEdges = result.edges;
  });

  return { nodes: updatedNodes, edges: updatedEdges };
};

const collapseSiblings = (currentNode, allNodes, allEdges, expandedMapRef) => {
  const parentId = currentNode.data.parent;
  const siblingNodes = allNodes.filter(
    (n) => n.data.parent === parentId && n.id !== currentNode.id
  );

  let updatedNodes = [...allNodes];
  let updatedEdges = [...allEdges];

  siblingNodes.forEach((sibling) => {
    if (expandedMapRef.current.get(sibling.id)) {
      expandedMapRef.current.set(sibling.id, false);
      const result = recursivelyRemoveChildren(
        sibling.id,
        updatedNodes,
        updatedEdges
      );
      updatedNodes = result.nodes;
      updatedEdges = result.edges;
    }
  });

  return { nodes: updatedNodes, edges: updatedEdges };
};

const LineageFlow = ({ lineageData }) => {
  const rawData = Array.isArray(lineageData)
    ? lineageData
    : lineageData.data || [];

  const initialNodes = [
    createNode("Data Source", "source", { x: 100, y: 100 }, { parent: null }),
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const expandedMap = useRef(new Map());

  const toggleExpansion = (nodeId) => {
    const isExpanded = expandedMap.current.get(nodeId);
    expandedMap.current.set(nodeId, !isExpanded);
    return !isExpanded;
  };

  const onNodeClick = useCallback(
    (e, node) => {
      const { labelRaw, title: type } = node.data;
      const nodeId = node.id;
      const isExpanding = toggleExpansion(nodeId);

      if (!isExpanding) {
        const result = recursivelyRemoveChildren(nodeId, nodes, edges);
        setNodes(result.nodes);
        setEdges(result.edges);
        return;
      }

      const collapsed = collapseSiblings(node, nodes, edges, expandedMap);
      setNodes(collapsed.nodes);
      setEdges(collapsed.edges);

      // Expand logic
      if (labelRaw === "Data Source") {
        const newNodes = rawData.map((entry, i) =>
          createNode(
            entry.source,
            "source",
            {
              x: node.position.x + 250,
              y: 100 + i * 100,
            },
            { parent: nodeId }
          )
        );
        const newEdges = newNodes.map((n) => ({
          id: `e${nodeId}-${n.id}`,
          source: nodeId,
          target: n.id,
          animated: true,
        }));
        setNodes((nds) => [...nds, ...newNodes]);
        setEdges((eds) => [...eds, ...newEdges]);
      }

      if (type === "source") {
        const sourceData = rawData.find((d) => d.source === labelRaw);
        if (!sourceData || !Array.isArray(sourceData.loadType)) return;
        const newNodes = sourceData.loadType.map((lt, i) =>
          createNode(
            lt,
            "loadType",
            {
              x: node.position.x + 250,
              y: node.position.y + i * 120,
            },
            { source: labelRaw, parent: nodeId }
          )
        );
        const newEdges = newNodes.map((n) => ({
          id: `e${nodeId}-${n.id}`,
          source: nodeId,
          target: n.id,
          animated: true,
        }));
        setNodes((nds) => [...nds, ...newNodes]);
        setEdges((eds) => [...eds, ...newEdges]);
      }

      if (type === "loadType") {
        const { source } = node.data;
        const sourceData = rawData.find((d) => d.source === source);
        const detail = sourceData?.loadTypeDetails?.find(
          (d) => d.loadType === labelRaw
        );
        if (!detail || !Array.isArray(detail.ETLPipeline)) return;
        const newNodes = detail.ETLPipeline.map((pipe, i) =>
          createNode(
            pipe,
            "pipeline",
            {
              x: node.position.x + 250,
              y: node.position.y + i * 100,
            },
            { source, loadType: labelRaw, pipelineIndex: i, parent: nodeId }
          )
        );
        const newEdges = newNodes.map((n) => ({
          id: `e${nodeId}-${n.id}`,
          source: nodeId,
          target: n.id,
          animated: true,
        }));
        setNodes((nds) => [...nds, ...newNodes]);
        setEdges((eds) => [...eds, ...newEdges]);
      }

      if (type === "pipeline") {
        const { source, loadType, pipelineIndex } = node.data;
        const sourceData = rawData.find((d) => d.source === source);
        const detail = sourceData?.loadTypeDetails?.find(
          (d) => d.loadType === loadType
        );
        const count = Array.isArray(detail?.totalDestinationTables)
          ? detail.totalDestinationTables[pipelineIndex] || 0
          : 0;
        const countNode = createNode(
          `${count} Tables`,
          "tableCount",
          { x: node.position.x + 250, y: node.position.y },
          { source, loadType, pipelineIndex, parent: nodeId }
        );
        setNodes((nds) => [...nds, countNode]);
        setEdges((eds) => [
          ...eds,
          {
            id: `e${nodeId}-${countNode.id}`,
            source: nodeId,
            target: countNode.id,
            animated: true,
          },
        ]);
      }

      if (type === "tableCount") {
        const { source, loadType, pipelineIndex } = node.data;
        const sourceData = rawData.find((d) => d.source === source);
        const detail = sourceData?.loadTypeDetails?.find(
          (d) => d.loadType === loadType
        );
        const tableName = Array.isArray(detail?.destinationTables)
          ? detail.destinationTables[pipelineIndex]
          : null;
        if (!tableName) return;
        const tableNode = createNode(
          tableName,
          "table",
          { x: node.position.x + 250, y: node.position.y },
          { source, table: tableName, parent: nodeId }
        );
        setNodes((nds) => [...nds, tableNode]);
        setEdges((eds) => [
          ...eds,
          {
            id: `e${nodeId}-${tableNode.id}`,
            source: nodeId,
            target: tableNode.id,
            animated: true,
          },
        ]);
      }

      if (type === "table") {
        const { source } = node.data;

        // 1. Look up this source in your JSON
        const sourceData = rawData.find((d) => d.source === source);
        // 2. Grab its destination array (fall back to empty)
        const destArr = Array.isArray(sourceData?.destination)
          ? sourceData.destination
          : [];
        // 3. Pick the first destination
        const destLabel =
          destArr.length > 0 ? destArr[0] : "Unknown Destination";

        // 4. Create the node with that label
        const destNode = createNode(
          destLabel,
          "destination",
          {
            x: node.position.x + 250,
            y: node.position.y,
          },
          { source, parent: nodeId }
        );

        setNodes((nds) => [...nds, destNode]);
        setEdges((eds) => [
          ...eds,
          {
            id: `e${nodeId}-${destNode.id}`,
            source: nodeId,
            target: destNode.id,
            animated: true,
          },
        ]);
      }
    },
    [rawData, nodes, edges, setNodes, setEdges]
  );

  return (
    <div className="h-[77vh] w-full bg-white rounded-lg shadow-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default LineageFlow;
