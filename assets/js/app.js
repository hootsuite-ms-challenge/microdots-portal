var app = {
    dataUrl: '',
    options: {},
    nodesList: [],
    edgesList: [],
    interval: 2, // in seconds
    repeater: null,

    nodes: new vis.DataSet(this.nodesList),
    edges: new vis.DataSet(this.edgesList),

    init: function() {
        this.configURL();
        this.config();
        this.ploter();
        this.updateNetwork();
        this.synchronizer();
    },

    configURL: function() {
        var url = '';
        if (this.dataUrl == '') {
            url += window.location.protocol + '//';
            url += window.location.hostname;
            url += ':8001/graph/';
            this.dataUrl = url;
        }

        $('#url-config').find('input').attr('placeholder', this.dataUrl);
    },

    changeURL: function() {
        var $input = $('#url-config').find('input');
        var url = $input.val();
        app.dataUrl = url;
    },

    synchronizer: function() {
        var self = this;
        self.loadJson();
        setTimeout(function() {self.synchronizer()}, self.interval * 1000);
    },

    loadJson: function() {
        var self = this;
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
                color: {background: '#768BFF', highlight: '#303D88', hover: '#303D88', border: '#768BFF'},
                shape: 'dot',
                scaling: {
                    customScalingFunction: function (min, max, total, value) {
                        return value/total;
                    },
                    min: 5,
                    max: 400,
                },
                font: {
                    size: 11, // px
                    align: 'center'
                },
            },
            edges: {
                color: '#E88787',
                width: 1,
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
        this.bindEvents();
    },

    bindEvents: function() {
        var self = this;

        $(document).on('click', '.btn-save-url', function(e) {
            self.changeURL();
        });

        this.network.on("selectNode", function (params) {
            var nodeID = params.nodes[0];
            var node = self.nodes.get(nodeID);

            var $div = $('<div>');
            $div.append($('<p>').html('Microservice: ' + node.id));

            if (node.endpoints && node.endpoints.length > 0) {
                var $ul = $('<ul>');
                node.endpoints.forEach(function(endpoint) {
                    $ul.append($('<li>').html(endpoint));
                });
                $div.append($('<p>').html('Endpoints: ' + $ul.html()));
            }

            $('#info-content').html($div);
        });

        this.network.on("deselectNode", function (params) {
            $('#info-content').html('');
        });

        this.network.on("selectEdge", function (params) {
            var edgeID = params.edges[0];
            var edge = self.edges.get(edgeID);
            var $div = $('<div>');
            $div.append($('<p>').html('From: ' + edge.from));
            $div.append($('<p>').html('To: ' + edge.to));
            $div.append($('<p>').html('Usage: ' + edge.usage));

            $('#info-content').html($div);
        });
        this.network.on("deselectEdge", function (params) {
            $('#info-content').html('');
        });
    },
};

$(document).ready(function() {
    app.init();
});
