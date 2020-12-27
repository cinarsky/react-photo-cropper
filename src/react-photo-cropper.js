import React, { Component } from 'react'
import { Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

class ReactPhotoCropper extends Component {

  constructor(props) {
    super(props)
    this.state = {
      resetInput: true,
      currentImg: '',
      currentImgUrl: '',
      // visible: !false
    }
  }

  imgChange = (e) => {

    const reader = new FileReader();
    reader.onload = (e) => {
      const blob = new Blob([e.target.result])
      const bolbUrl = URL.createObjectURL(blob)
      this.setState({
        resetInput: false,
        visible: true,
        currentImg: blob,
        currentImgUrl: bolbUrl
      }, () => {
        this.setState({
          resetInput: true
        })
        this.cropperContentRef = document.getElementById('react-photo-cropper-dialog-content')
        this.cropperBoxRef = document.getElementById('cropper-box-cutter')
        this.cropperContentRef.addEventListener('click', this.handleFunc)
        this.cropperBoxRef.addEventListener('mousedown', this.handleFunc)
        this.cropperBoxRef.addEventListener('mousemove', this.handleFunc)
      })
    }
    reader.readAsArrayBuffer(e.target.files[0]);
  }

  handleFunc = (e) => {
    console.log(e, e.offsetX, (this.cropperBoxRef.style.left || '0px').split('px')[0]);
    const left = Number((this.cropperBoxRef.style.left || '0px').split('px')[0])
    const top = Number((this.cropperBoxRef.style.left || '0px').split('px')[0])
    this.cropperBoxRef.style.left = `${e.offsetX + left}px`
    this.cropperBoxRef.style.top = `${e.offsetX + top}px`
  }

  closeDialog = () => {
    this.cropperContentRef.removeEventListener('click', this.handleFunc)
    this.cropperBoxRef.removeEventListener('mousedown', this.handleFunc)
    this.cropperBoxRef.removeEventListener('mousemove', this.handleFunc)
    this.setState({
      visible: false
    })
  }

  render() {
    const { resetInput, visible, currentImgUrl } = this.state
    console.log(this.state);
    return (
      <div className="react-photo-cropper">
        <div className='cropper'>
          <label htmlFor='cropper-label-input' className='cropper-label'>
            <PlusOutlined className='cropper-label-icon' />
            添加图片
          </label>
          {resetInput && <input id='cropper-label-input' className='cropper-label-input' type='file' accept='image' onChange={this.imgChange} />}
        </div>

        <Modal
          visible={visible}
          mask
          className="react-photo-cropper-dialog"
          onOk={this.closeDialog}
        >
          <div
            id="react-photo-cropper-dialog-content"
            className="react-photo-cropper-dialog-content"
          >
            <img
              src={currentImgUrl}
              className='cropper-box-img'
              style={{
                display: 'block',
                margin: '0 auto',
                width: '400px',
                // height: '100px'
              }}
            />
            <div
              id='cropper-box-cutter'
              className='cropper-box-cutter'
              style={{
                top: '10px'
              }}
            ></div>
          </div>
        </Modal>
      </div>
    );
  }

}

export default ReactPhotoCropper;
