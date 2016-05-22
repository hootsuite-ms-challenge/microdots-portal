var app = {
    dataUrl: 'http://192.168.0.10:8001/graph/',
    options: {},
    nodesList: [],
    edgesList: [],
    interval: 4, // in seconds
    repeater: null,

    nodes: new vis.DataSet(this.nodesList),
    edges: new vis.DataSet(this.edgesList),

    init: function() {
        this.config();
        this.ploter();
        this.updateNetwork();
        this.synchronizer();
    },

    synchronizer: function() {
        var self = this;
        console.log('sincroniza');
        self.loadJson();

        setTimeout(function() {self.synchronizer()}, self.interval * 1000);
    },

    loadJson: function() {
        var self = this;
        //self.dataUrl = 'data.json';
        $.getJSON(self.dataUrl, function(data) {
            self.nodesList = data.nodes;
            self.edgesList = data.edges;

            self.updateData();
        });
    },

    updateData: function() {
        var self = this;
        var itens, ids;

        itens = [];
        this.nodesList.forEach(function(node) {
            self.nodes.update(node);
            itens.push(node.id);
        });

        ids = self.nodes.getIds();
        ids.forEach(function(id) {
            if (itens.indexOf(id) < 0) {
                self.nodes.remove(id);
            }
        });

        itens = [];
        this.edgesList.forEach(function(edge) {
            self.edges.update(edge);
            itens.push(edge.id);
        });

        ids = self.edges.getIds();
        ids.forEach(function(id) {
            if (itens.indexOf(id) < 0) {
                self.edges.remove(id);
            }
        });

    },

    updateNetwork: function() {
        this.nodes.clear();
        this.edges.clear();
        this.nodes.add(this.nodesList);
        this.edges.add(this.edgesList);
    },

    refresh: function() {
        this.network.setData({nodes: this.nodes, edges: this.edges});
    },

    config: function() {
        this.options = {
            nodes : {
                color: {background: '#768BFF', highlight: '', hover: '', border: '#768BFF'},
                shape: 'dot',
                scaling: {
                    customScalingFunction: function (min, max, total, value) {
                        return value/total;
                    },
                    min: 5,
                    max: 50,
                }
            },
            edges: {
                color: '#768BFF',
                width: 3,
                smooth: {
                    "type": "continuous",
                    "forceDirection": "none"
                },
                arrows: {to: true},
            },
            interaction: {
                hover: true
            },
            physics: {
                maxVelocity: 5,
                enabled: true,
                stabilization: false,
            },
            layout: {
            },
        };
    },

    ploter: function() {
        this.container = $('#network')[0];

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
