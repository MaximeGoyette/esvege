import React, { Component } from 'react'
import classNames from 'classnames'

class Section extends Component {

    render() {
        const { dim } = this.props

        return (
            <div className={classNames('section', this.props.className)} style={{ left: `${dim[0]}vw`, top: `${dim[1]}vh`, width: `${dim[2]}vw`, height: `${dim[3]}vh` }}>
                {this.props.children}
            </div>
        )
    }

}

export default Section