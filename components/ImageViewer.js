import React from 'react';
import PropTypes from 'prop-types';
import Viewer from 'react-viewer';

class ImageViewer extends React.Component {
  state = {
    visible: false
  };

  render() {
    const { visible } = this.state;
    const { img } = this.props;

    if (!img) {
      return null
    }

    return <div>
      <img src={img} style={{width: '100%'}} onClick={() => this.setState({visible: true})} />
      <Viewer
        visible={visible}
        images={[{ src: img }]}
        onClose={() => this.setState({visible: false})}
      />
    </div>

  }
}

ImageViewer.PropTypes = {
  img: PropTypes.string
}

export default ImageViewer