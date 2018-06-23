import React, {Component} from 'react'
import {render} from 'react-dom'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import ReactPropsEditor, { PropObjects } from '../../src'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Demo extends Component {
  state = {
    propValues:{}
  }
  render() {
    return <div>
      <h1>react-props-editor Demo</h1>
      <div>-----Prop Names-------</div>
      <ReactPropsEditor 
      onChange={({propValues})=>{
        this.setState({propValues})
      }} 
      defaultValues={{
        name: 'sdfwer'
      }}
      propObjects={{
        name: PropObjects.string.render(
          ({onChange, propValues})=>{
            return <input type='text' value={propValues.name} 
            onChange={e=>onChange(e.target.value)}/>
        }),
        location: PropObjects.string.render(({
          onChange,
          propValues
        })=>{
          return <PlacesAutocomplete
          value={this.state.address || ''}
          onChange={(address) => {
            this.setState({ address })
          }}
          onSelect={(address) => {
            geocodeByAddress(address)
              .then(results => getLatLng(results[0]))
              .then(latLng => {
                console.log('Success', latLng)
                onChange(`${latLng.lat}:${latLng.lng}`);
              })
              .catch(error => console.error('Error', error))
          }}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input'
                })}
              />
              <div className="autocomplete-dropdown-container">
                {suggestions.map(suggestion => {
                  const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                              ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                              : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div {...getSuggestionItemProps(suggestion, { className, style })}>
                      <span>{suggestion.description}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        }),
        city: PropObjects.number
      }} />
      <div>
        <br/>
        <div>-----Prop Values-------</div>
        {Object.keys(this.state.propValues).map(propKey=>{
          return <div key={propKey} >{propKey},{this.state.propValues[propKey]}</div>
        })}
      </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
