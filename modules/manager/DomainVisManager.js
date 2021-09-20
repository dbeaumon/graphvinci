import DomainNodeSizer from './DomainNodeSizer.js';
import * as d3 from "d3";
import VisManager from './VisManager.js';
import Visualizer from "../Visualizer";

const bigClass = "domainheader";

export default class DomainVisManager extends VisManager {
    constructor(node) {
        super(node);
        this.sizing = new DomainNodeSizer(node.name);
    }

    build(group) {
        if (typeof (group) !== 'undefined') {
            this.group = group;
        }
        this.switch = !this.switch;

        // Create the master container, if it doesn't already exist using a single-element array
        d3.select(this.group)
            .selectAll('.masterGroup')
            .data(['master'])
            .enter()
            .append('g')
            .attr('class', "masterGroup");

        // Select the master, whether it was created or not in this round
        let master = d3.select(this.group).select('.masterGroup');

        // Append the "subdermal" color layer
        master.selectAll('.subgroup')
            .data(['subdermis'])
            .enter()
            .append('g')
            .attr('class', "subgroup")
            .append('rect')
            .attr('class', "subdermis")
            .attr('width', this.sizing.width)
            .attr('height', this.sizing.height)
            .attr('rx', 40)
            .attr('fill', Visualizer.d3utils.get_color(this.node.domain));

        // Add the mask
        master.selectAll('.mask')
            .data(['mask'])
            .enter()
            .append('g')
            .attr('class', "mask")
            .append('rect')
            .attr('class', "masklayer")
            .attr('width', this.sizing.width)
            .attr('height', this.sizing.height)
            .attr('rx', 40)
            .attr('fill', "white")
            .attr('opacity', 0.4);

        master
            .append('text')
            .text(d => d.name)
            .attr('class', bigClass)
            .attr('x', this.sizing.centerTextAnchorX)
            .attr('y', this.sizing.rowMidPoint)
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'middle');

        // Remove and re-create the incoming attachment points
        this._append_incoming_group(master);

        // Apply the "epidermis" top layer
        master.selectAll('.overlay')
            .data(['epidermis'])
            .enter()
            .append('g')
            .attr('class', "overlay")
            .append('rect')
            .attr('class', "epidermis")
            .attr('width', this.sizing.width)
            .attr('height', this.sizing.height)
            .attr('stroke', Visualizer.d3utils.get_color(this.node.domain))
            .attr('stroke-width', 25)
            .attr('rx', 40)
            .attr('fill', "none");

        // Apply transitions
        this._manage_transitions(master);
    }

    _manage_transitions(master) {
        let easeType = d3.easeBounce;
        let transitionDuration = 1500;
        /*
        Keeping a placeholder in case I want to run transitions on domains.  I dont think I do.
         */
    }

    _append_incoming_group(master) {

        master.selectAll('.incomingSelector')
            .data(this.sizing.targetPoints)
            .enter()
            .append('circle')
            .attr('class', "incomingSelector")
            .attr("r", 0)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("fill", function (d) {
                return "black";
            });
    }

    getSourceConnectionPoint(fieldName, destination) {
        return this.getIncomingConnectionPoint(destination);
    }

    getIncomingConnectionPoint(source) {
        let selector = d3.select(this.group)
            .selectAll('.incomingSelector');
        let candidates = this.getCandidates(selector);
        return Visualizer.d3utils.get_closest_point(source, candidates);
    }

    getEntityConnectionPoint(source) {
        let selector = d3.select(this.group)
            .selectAll('.entitySelector');
        let candidates = this.getCandidates(selector);
        return Visualizer.d3utils.get_closest_point(source, candidates);
    }

}