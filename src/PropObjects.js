import React from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash';

export const TYPE_CONVERTER = {
    array(value, propTypes){
        //TODO: array not supported yet
        if(Array.isArray(value)){
            return value.map((v,i)=>TYPE_CONVERTER[i](value,propTypes[i]));
        }
    },
    bool(value){
        return JSON.parse(value);
    },
    func(value){
        return value;
    },
    number(value){
        return Number(value);
    },
    object(value){
        return value;
    },
    string(value){
        return value.toString();
    },
    symbol(value){
        return value
    }
}

export function toPropTypes(propObjects){
    return _.mapValues(propObjects,(o=>o.propType));
}

export function parseGraphData({name,types,values,...rest}){
    
    const jsonTypes = JSON.parse(types)
    const jsonValues = JSON.parse(values);
    
    //convert types
    for (const key in jsonValues) {
        const value = jsonValues[key]
        let propType = jsonTypes[key];
        jsonValues[key] = TYPE_CONVERTER[propType](value);
    }
    const parsedData =  {
        name,
        types: jsonTypes,
        values: jsonValues,
        ...rest
    }
    return parsedData;
}


const PROP_TYPE_NAMES = _.compact(
    Object.keys(PropTypes).map(k => {
      if ([   
        // 'array',
        'bool',
        'number',
        // 'object',
        'string',
        // 'symbol'
        ].indexOf(k)>-1) {
        return k;
      }
      return undefined;
    })
  );
const tmpWPT = {}

PROP_TYPE_NAMES.forEach(k=>{
    tmpWPT[k] = {
        typeName: k,
        propType: PropTypes[k],
        render(renderComponent){
            return {
                typeName: k,
                propType: PropTypes[k],
                renderComponent
            }
        }
    };
})

const nPropTypes = tmpWPT;
export default nPropTypes;