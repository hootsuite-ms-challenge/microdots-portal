var app = {
    dataUrl: 'http://192.168.0.10:8001/graph/',
    dataUrl: 'data.json',
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
        url += window.location.protocol + '//';
        url += window.location.hostname;
        url += ':8001/graph/';

        this.dataUrl = url;
        $('#url-config').find('input').attr('placeholder', url);
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
    },
};

$(document).ready(function() {
    app.init();
});
