import React, { Component, createContext } from 'react'
import Section from './Section'
import Canvas from './Canvas'
import _ from 'lodash'
import ReactCursorPosition from 'react-cursor-position'
import classNames from 'classnames'

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
        },
        tempState: {
            upToDate: false,
            valid: false,
            content: ''
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

    componentDidMount() {
        this.setState({
            tempState: {
                upToDate: false,
                valid: false,
                content: JSON.stringify(_.pickBy(this.state, (v, k) => k !== 'tempState'), null, 4)
            }
        })
    }

    componentDidUpdate() {
        const { tempState: { upToDate } } = this.state

        if (!upToDate) {
            this.setState({
                tempState: {
                    upToDate: true,
                    valid: true,
                    content: JSON.stringify(_.pickBy(this.state, (v, k) => k !== 'tempState'), null, 4)
                }
            })
        }
    }

    validateState = (content) => {
        try {
            const newState = JSON.parse(content)
            this.setState({
                ...newState,
                tempState: {
                    upToDate: false,
                    valid: true
                }
            })
        } catch (err) {
            this.setState({
                tempState: {
                    ...this.state.tempState,
                    valid: false
                }
            })
        }
    }

    onStateChange = (e) => {
        this.setState({
            tempState: {
                ...this.state.tempState,
                content: e.target.value
            }
        })
        this.validateState(e.target.value)
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
                    <textarea className={classNames('fill', { 'invalid': !state.tempState.valid })} onChange={this.onStateChange} spellCheck="false" value={state.tempState.content} />
                </Section>
            </EditorContext.Provider>
		)
	}
}

export default Editor
