import React from 'react'
import PropTypes from 'prop-types'

import { EditorContext } from './Editor'
import { applySnap } from '../utils/coordinate'

const Circle = (props) => {
    const { stroke, fill, selected, x, y, ...otherProps } = props
    return (
        <EditorContext.Consumer>
            {({ state: { grid: { snap, size } } }) => (
                <circle {...otherProps} cx={snap ? applySnap(x, size) : x} cy={snap ? applySnap(y, size) : y} stroke={selected ? 'navy' : stroke} fill={selected ? 'aqua' : fill} />
            )}
        </EditorContext.Consumer>
    )
}

Circle.propTypes = {
    cx: PropTypes.number,
    cy: PropTypes.number,
    r: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    fill: PropTypes.string,
    selected: PropTypes.bool
}

Circle.defaultProps = {
    cx: 50,
    cy: 50,
    r: 40,
    stroke: 'black',
    strokeWidth: 1,
    fill: 'white',
    selected: false
}

export default Circle