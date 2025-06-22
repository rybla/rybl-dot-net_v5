function createGraph(nodes_data, edges_data) {
  const container = document.getElementById("graph-container");

  // const nodes = new vis.DataSet([
  //   { id: 1, label: "Note A:\nIntroduction to AI", url: "#note-a" },
  //   { id: 2, label: "Note B:\nMachine Learning", url: "#note-b" },
  //   { id: 3, label: "Note C:\nDeep Learning", url: "#note-c" },
  //   { id: 4, label: "Note D:\nNatural Language Proc.", url: "#note-d" },
  //   { id: 5, label: "Note E:\nComputer Vision", url: "#note-e" },
  //   { id: 6, label: "Note F:\nReinforcement Learning", url: "#note-f" },
  //   { id: 7, label: "Source:\nKey Research Papers", url: "#source-papers" },
  //   { id: 8, label: "Application:\nSelf-Driving Cars", url: "#app-cars" },
  // ]);
  const nodes = new vis.DataSet(nodes_data);

  // const edges = new vis.DataSet([
  //   { from: 1, to: 2 },
  //   { from: 2, to: 3 },
  //   { from: 2, to: 4 },
  //   { from: 2, to: 5 },
  //   { from: 3, to: 5 },
  //   { from: 3, to: 6 },
  //   { from: 4, to: 7 },
  //   { from: 5, to: 7 },
  //   { from: 5, to: 8 },
  //   { from: 6, to: 8 },
  //   { from: 1, to: 7 },
  // ]);

  const edges = new vis.DataSet(edges_data);

  const data = {
    nodes: nodes,
    edges: edges,
  };

  const options = {
    nodes: {
      shape: "box",
      margin: 12,
      widthConstraint: {
        maximum: 200,
      },
      font: {
        color: "#343434",
        size: 15,
        face: "Inter",
        strokeWidth: 4,
        strokeColor: "#ffffff",
        multi: "md",
      },
      color: {
        border: "#4c5cf3",
        background: "#eef0ff",
        highlight: {
          border: "#4c5cf3",
          background: "#d9dffc",
        },
      },
      shadow: true,
      chosen: {
        label: function (values, id, selected, hovering) {
          // This empty function overrides the default behavior,
          // which is to make the label bold on hover.
        },
      },
    },
    edges: {
      width: 2,
      color: {
        color: "#cccccc",
        highlight: "#4c5cf3",
      },
      arrows: {
        to: { enabled: true, scaleFactor: 0.7 },
      },
      smooth: {
        type: "continuous",
      },
    },
    physics: {
      enabled: true,
      barnesHut: {
        gravitationalConstant: -8000,
        centralGravity: 0.4,
        springLength: 250,
        springConstant: 0.05,
        damping: 0.09,
        avoidOverlap: 0.2,
      },
      solver: "barnesHut",
      stabilization: {
        iterations: 1500,
      },
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      dragNodes: true,
      dragView: true,
      zoomView: true,
    },
  };

  const network = new vis.Network(container, data, options);

  network.on("stabilizationIterationsDone", function () {
    network.setOptions({ physics: false });
  });

  network.on("click", function (params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = nodes.get(nodeId);
      if (node && node.url) {
        window.open(node.url, "_blank");
      }
    }
  });
}
