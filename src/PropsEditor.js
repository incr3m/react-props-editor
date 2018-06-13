import React, { Component } from "react";
import PropTypes from "prop-types";
import { toPropTypes } from './PropObjects'
import _ from "lodash";
// import {
//     Form,
//     List
// } from 'semantic-ui-react'

function getPropTypeName(propType) {
    return propType.typeName;
}

function resolveValue(value){
  let pFnc = value;
  if (typeof value === 'function')
    pFnc = value();
  return Promise.resolve(pFnc)
}

function toJsonOpts(options){
    return options.map(opt=>{
        return {
            key:(opt.key||opt),
            text:(opt.text||opt),
        }
    })
}

function cleanState(state){
    const changedProps = Object.assign({},state);
    delete changedProps.propsTypes;
    delete changedProps.propsTypeOptions;
    delete changedProps.propsTypeRender;
    return changedProps;
}

export default class PropsEditor extends Component {
    state = {}
  async triggerChange(){
    const { onChange, propObjects } = this.props;
    const changedProps = cleanState(this.state);
    const thePropTypes = toPropTypes(await resolveValue(propObjects));
    //TODO: add field validation
    PropTypes.checkPropTypes(thePropTypes, changedProps, 'prop', 'PropsEditor');
    onChange && onChange({
        propTypes:this.state.propsTypes,
        propValues:changedProps});
  }
  
  async componentDidMount(){
      const { propObjects={} } = this.props;
      const thePropTypes = await resolveValue(propObjects)
      const propsTypeOptions = {};
      const propsTypeRender = {}
      const propsTypes = {}
      for (const propKey in thePropTypes) {
          propsTypes[propKey] = getPropTypeName(thePropTypes[propKey]);
          if(thePropTypes[propKey].options){
            propsTypeOptions[propKey] = toJsonOpts(await resolveValue(thePropTypes[propKey].options));
          }
          if(thePropTypes[propKey].renderComponent){
            propsTypeRender[propKey] = thePropTypes[propKey].renderComponent;
          }
      }
      this.setState({ propsTypes,
            propsTypeOptions,
            propsTypeRender 
        })
  }

  render() {
    const { propsTypes, propsTypeOptions, propsTypeRender } = this.state;
    if (!propsTypes) {
      return <div>loading...</div>
    }
    return (
        <div>
          {Object.keys(propsTypes).map(pKey => {
            // return <div key={pKey}>
            //     <div>key:{pKey}</div>
            //     <div>type:{propsTypes[pKey]}</div>
            //     <div>options:{propsTypeOptions[pKey] && propsTypeOptions[pKey].map(opt=><div key={opt.key}>{opt.key},{opt.text}</div>)}</div>
            //     <div>optionComponent: {propsTypeRender[pKey]?propsTypeRender[pKey]():''} </div>
            //     <div>----</div>
            // </div>
            if(!propsTypeRender[pKey]) return <div key={pKey}>Error: no render component defined for prop "{pKey}"</div>;
            return <div key={pKey}>{propsTypeRender[pKey]({
                onChange:async (value)=>{
                    await this.setState({[pKey]:value});
                    return this.triggerChange()
                },
                propValues:cleanState(this.state)
            })}</div>
          })}
        </div>
    );
  }
}

//   <List horizontal>
    //     {Object.keys(propsTypes).map(pKey => {
    //       const propName = propsTypes[pKey];
    //       const labelTxt = _.capitalize(_.kebabCase(pKey).replace('-',' '));
    //       return (
    //           <List.Item key={pKey}>
    //           { propsTypeOptions[pKey] &&
    //             <Form.Select label={`${labelTxt} `} 
    //               options={propsTypeOptions[pKey].map(opt=>({
    //                 text:opt,
    //                 value:opt
    //               }))}
    //               onChange={async (e,data) => {
    //                 await this.setState({ [pKey]: (data.value) } )
    //                 this.triggerChange();
    //             }}/>
    //           }
    //           { !propsTypeOptions[pKey] &&
    //             <React.Fragment>
    //             {["string", "number"].indexOf(propName) > -1 && (
    //               <Form.Input label={`${labelTxt} `} onChange={async (data) => {
    //                   await this.setState({ [pKey]: (data.target.value) } )
    //                   this.triggerChange();
    //                 }}/>
    //             )}
    //             {["bool"].indexOf(propName) > -1 && (
    //                 <Form.Checkbox label={labelTxt} onChange={async (_,data) => {
    //                   await this.setState({[pKey]: (data.checked) });
    //                   this.triggerChange();
    //                 }}/>
    //             )}
    //             </React.Fragment>
    //           }
    //           </List.Item>
    //       );
    //     })}
    //   </List>