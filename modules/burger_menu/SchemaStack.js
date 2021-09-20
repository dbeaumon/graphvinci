import {CONTRASTCOLOR} from "./VerticalMenu.js";
import StackableElementWithButtons from "./StackableElementWithButtons";

export default class SchemaStack extends StackableElementWithButtons  {
    constructor(width, height) {
        super(width, height, "SchemaStack", true);
        this.add_button_details(
            {
                altText: "Create New",
                position: 1,
                img: "images/buttons/create.png",
                fillColor: "#f5f5f5",
                strokeColor: "#acacac",
                clickFunction: function(){
                    let endpoint = Visualizer.config.add_new_blank_schema();
                    Visualizer.config.set_current_schema(endpoint.name)
                    Visualizer.config_manager.verticalMenu.set_open_to(endpoint)
                    Visualizer.config_manager.render({})
                }
            }
        )
    }

    get id() {
        return this.type;
    }

    buildFunction(group) {
        group.append('text')
            .text("Schemas")
            .attr('x', d => d.width / 2)
            .attr('y', d => d.height / 2)
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'middle')
            .attr('stroke', CONTRASTCOLOR)

        group.append('rect')
            .attr('width', d => this.width)
            .attr('height', d => this.height)
            .attr('opacity', 0)
            .attr('fill', "#fff")
            .classed('mousepointer', true)
            .on('click', d => {
                let current = d.expanded;
                Visualizer.config_manager.verticalMenu.set_open_to(null)
                if (current) {
                    d.contract();
                }
                else {
                    d.expand();
                }
                Visualizer.config_manager.update({});
            })
        this.add_buttons(group, false)
    }

}