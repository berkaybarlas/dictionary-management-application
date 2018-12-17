import React, { Component } from 'react';
import { findDOMNode } from "react-dom";

import PropTypes from "prop-types";
import "./components.css"

class ScrollView extends Component {
    static childContextTypes = {
      scroll: PropTypes.object,
    }
    elements = {};
    register = (name, ref) => {
        this.elements[name] = ref;
    }

    unregister = (name) => {
        delete this.elements[name];
    }
    getChildContext() {
        return {
          scroll: {
            register: this.register,
            unregister: this.unregister
          }
        }
    }
    render() {
      return (
        React.Children.only(this.props.children)
      );
    }
  }

  class ScrollElement extends Component {
    static contextTypes = {
        scroll: PropTypes.object,
      }
      componentDidMount() {
        this.context.scroll.register(this.props.name, this._element);
      }
      componentWillUnmount() {
        this.context.scroll.unregister(this.props.name);
      }
    render() {
      return (
        React.cloneElement(this.props.children, {
          ref: ref => this._element = ref
        })
      );
    }
  }

  export {
    ScrollElement
  }
  
  export default ScrollView;