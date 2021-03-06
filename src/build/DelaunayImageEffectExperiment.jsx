import React from 'react';
import ReactDOM from 'react-dom';
import DelaunayImageEffect from 'delaunay-image-effect';
import Panel from './Panel.jsx';

class DelaunayImageEffectExperiment extends React.Component {

    //--------------------------------- constructor
    constructor(props, context){
        super(props, context);
        this.declareConstants();
    }

    //--------------------------------- declareConstants
    declareConstants(){
        this.IMG_SRC                    = "/assets/img/experiments/car-book-map.jpg";
        this.declareStyleConstants();
    }

    //--------------------------------- declareStyleConstants
    declareStyleConstants(){
        this.STYLE                      = {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%'
        };
        this.PLUGIN_STYLE               = {
                                            width: '100%',
                                            height: '100%'
        };
    }

    //--------------------------------- render
    render(){
        //want to start th eplugin 
        //combine props style with 
        //the style constant
        var style = Object.assign({}, this.STYLE);
        return(
            <Panel  data={this.props.data} 
                    is_active={this.props.is_active} 
                    is_previous={this.props.is_previous} 
                    show={this.props.show} 
                    hide={this.props.hide} 
                    direction={this.props.panel_direction} 
                    show_on_active={false}
                    stage_width={this.props.stage_width}
                    stage_height={this.props.stage_height}>
                <div ref="experimentHolder"></div>
            </Panel>
        );
    } 

    //--------------------------------- componentDidMount
    componentDidMount(){
        //want the plugin to be handled outside
        //of react  - so add it here -
        //so that react doesnt know about it
        this.canvas_el = document.createElement("CANVAS");
        this.canvas_el.style.width = this.props.data.width;
        this.canvas_el.style.height = this.props.data.height;
        this.canvas_el.setAttribute("resize", "true");

        var experiment_holder_el = ReactDOM.findDOMNode(this.refs.experimentHolder);
        experiment_holder_el.style.width = this.props.data.width;
        experiment_holder_el.style.height = this.props.data.height;
        experiment_holder_el.appendChild(this.canvas_el);

        this.delaunayImageEffect = new DelaunayImageEffect(this.canvas_el, this.IMG_SRC);
    }

    //--------------------------------- componentDidUpdate
    componentDidUpdate(prevProps, prevState){
        var self = this;
        var start_timeout, clear_timeout;

        //if window has resized
        if( prevProps.stage_width != this.props.stage_width ||
            prevProps.stage_height != this.props.stage_height ) {
            //paper js's resize handling is taking place
            //when the last dimmensions are still in place
            //so dispatch another event immediately to correct
            window.dispatchEvent(new Event('resize'));
        }

        if(this.props.is_active && this.props.show){
            if(!prevProps.show){
                clearTimeout(clear_timeout);
                start_timeout = setTimeout(function(){
                    self.delaunayImageEffect.reset();
                }, 200);
            }
        } 
        else{
             //only want to call clear when not active
            //and only once per deactivating
            if( (prevProps.is_active && !this.props.is_active) ){
                clearTimeout(start_timeout);
                clear_timeout = setTimeout(function(){
                    self.delaunayImageEffect.clear();
                }, 500);
            }
        }
    }

    //--------------------------------- componentWillReceiveProps
    componentWillReceiveProps(nextProps){
        // initialize
        // the plugin here
        if( !this.props.load_imgs && nextProps.load_imgs ) {
            //disable mouse if mobile
            var disableMouse = ( /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
                                .test(navigator.userAgent.toLowerCase()) );
            this.delaunayImageEffect.init(this.onImgsLoaded.bind(this), disableMouse);
        }
    }

    //--------------------------------- onImgsLoaded
    onImgsLoaded(){
        this.props.onImgsLoaded();
    }
}

export default DelaunayImageEffectExperiment;
