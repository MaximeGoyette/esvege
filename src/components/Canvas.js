import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import Circle from './Circle'

import { gridBackground } from '../utils/style'
import { EditorContext } from './Editor'

const Canvas = ({
    shapes,
    selectedShapes,
    shapeEvents: { onSelect, onDeselect, onDeselectAll, onMouseDown, onMouseUp, onMouseMove },
    position
}) => {

    const shapeObjs = _.map(shapes, (o, index) => {
        const {type, ...attr} = o
        switch (type) {
            case 'circle':
                return (
                    <Circle
                        {...attr}
                        key={index}
                        selected={selectedShapes.includes(index)}
                        onMouseDown={(e) => onSelect(index)}
                        onMouseUp={(e) => onDeselect(index)}
                    />
                )

            default:
                return null
        }
    })

    return (
        <EditorContext.Consumer>
            {({ state: { grid: { size, show } } }) => (
                <svg
                    onMouseDown={(e) => onMouseDown()}
                    onMouseMove={(e) => onMouseMove(position)}
                    onMouseUp={(e) => {onMouseUp(); onDeselectAll()}}
                    style={show ? gridBackground(size) : {}}
                >
                    {shapeObjs}
                </svg>
            )}
        </EditorContext.Consumer>
    )
}

Canvas.propTypes = {
    shapes: PropTypes.array,
    selectedShapes: PropTypes.array
}

Canvas.defaultProps = {
    shapes: [],
    selectedShapes: []
}

export default Canvas