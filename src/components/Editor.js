import React, { Component, createContext } from 'react'
import Section from './Section'
import Canvas from './Canvas'
import _ from 'lodash'
import ReactCursorPosition from 'react-cursor-position'
import JsonView from 'react-json-view'

export const EditorContext = createContext()

class Editor extends Component {
    state = {
        shapes: [
            {
                type: 'circle',
                x: 500,
                y: 200,
                r: 25
            },
            {
                type: 'circle',
                x: 300,
                y: 600,
                r: 50
            }
        ],

        selectedShapes: [],
        mouse: {

            pressed: false,

            position: {
                x: 0,
                y: 0
            }
        },
        grid: {
            size: 50,
            snap: true,
            show: true
        }
    }

    canvasEvents = {
        onSelect: (index) => {
            const { selectedShapes } = this.state
            if (!selectedShapes.includes(index)) {
                this.setState({ selectedShapes: [...selectedShapes, index] })
            }
        },
        onDeselect: (index) => {
            const { selectedShapes } = this.state
            this.setState({ selectedShapes: _.filter(selectedShapes, index) })
        },
        onDeselectAll: () => {
            this.setState({ selectedShapes: [] })
        },
        onMouseDown: () => {
            this.setState({
                mouse: {

                    ...this.state.mouse,

                    pressed: true
                }
            })
        },
        onMouseUp: () => {
            this.setState({
                mouse: {
                    ...this.state.mouse,
                    pressed: false,
                }
            })
        },
        onMouseMove: (position) => {
            const { shapes, selectedShapes, mouse } = this.state

            const newShapes = _.map(shapes, ({ type, x, y, ...otherAttr }, index) => {
                const offX = x - mouse.position.x
                const offY = y - mouse.position.y

                return {
                    ...otherAttr,
                    type,
                    x: selectedShapes.includes(index) ? position.x + offX : x,
                    y: selectedShapes.includes(index) ? position.y + offY : y
                }
            })

            this.setState({
                shapes: newShapes,
                mouse: {
                    ...this.state.mouse,
                    position
                }
            })
        }
    }

	render() {
        const { state } = this

        return (
            <EditorContext.Provider value={{ state }}>
                <Section className="canvas" dim={[0, 0, 70, 100]}>
                    <ReactCursorPosition className="fill">
                        <Canvas shapes={state.shapes} selectedShapes={state.selectedShapes} shapeEvents={this.canvasEvents}/>
                    </ReactCursorPosition>
                </Section>
                <Section className="state" dim={[70, 0, 30, 100]}>
                    <JsonView className="fill" src={state} theme="monokai" enableClipboard={false} displayObjectSize={false} displayDataTypes={false} onEdit={({ updated_src }) => this.setState(updated_src)} />
                </Section>
            </EditorContext.Provider>
		)
	}
}

export default Editor
