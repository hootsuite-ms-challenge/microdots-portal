var app = {
    options: {},
    nodesList: [],
    edgesList: [],

    nodes: new vis.DataSet(this.nodesList),
    edges: new vis.DataSet(this.edgesList),

    init: function() {
        this.config();
        this.ploter();
        this.updateNetwork();
        this.loadJson();
    },

    loadJson: function() {
        var self = this;
        $.getJSON( "data.json", function( data ) {
            self.nodesList = data.nodes;
            self.edgesList = data.edges;

            self.updateNetwork();
        });
    },

    prepareData: function() {
        this.nodesList = [
            {id: 1, label: 'Node 1'},
            {id: 2, label: 'Node 2'},
            {id: 3, label: 'Node 3', color: {background: '', highlight: ''}},
            {id: 4, label: 'Node 4'},
            {id: 5, label: 'Node 5'}
        ];
        this.edgesList = [
            {from: 1, to: 3, color: {color: ''}},
            {from: 1, to: 2},
            {from: 2, to: 4},
            {from: 2, to: 5}
        ];
    },

    updateNetwork: function() {
        this.nodes.clear();
        this.edges.clear();
        this.nodes.add(this.nodesList);
        this.edges.add(this.edgesList);
    },

    update: function() {
        this.nodes = new vis.DataSet(this.nodesList);
        this.edges = new vis.DataSet(this.edgesList);
        this.network.setData({nodes: this.nodes, edges: this.edges});
    },

    config: function() {
        this.options = {
            nodes : {
                color: {background: '#768BFF', highlight: '', hover: '', border: '#768BFF'},
                shape: 'dot',
                size: 20,
            },
            edges: {
                color: '#768BFF',
                width: 3,
                //smooth: false,
            },
            interaction: {hover: true},
            physics: { stabilization: true },
        };
    },

    ploter: function() {
        this.container = $('#mynetwork')[0];

        this.data = {
            nodes: this.nodes,
            edges: this.edges
        };

        // initialize your network!
        this.network = new vis.Network(this.container, this.data, this.options);
    },

    addNode: function() {
        this.nodes.add({label: 'Teste'});
        this.edges.add({from: 1, to: this.nodes.getIds().pop()});
    },
};

$(document).ready(function() {
    app.init();
});
