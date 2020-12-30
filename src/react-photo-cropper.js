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
      edge: 20
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
        this.cropperImgRef = document.getElementById('cropper-box-img')
        this.cropperBoxRef = document.getElementById('cropper-box-cutter')
        this.cropperBoxContentRef = document.getElementById('cropper-box-cutter-content')
        this.cropperContentRef.addEventListener('mousedown', this.handleContentMouseDown)
        // this.cropperImgRef.addEventListener('mousemove', this.handleImgMouseMove)
        this.cropperBoxContentRef.addEventListener('mousedown', this.handleMouseDown)
      })
    }
    reader.readAsArrayBuffer(e.target.files[0]);
  }
  handleImgMouseMove = (e) => {
    e.preventDefault()
  }
  handleContentMouseDown = (e) => {
    // console.log(1,e.layerX, e.layerY);
    console.log(e, e.layerX, e.layerY);
    if (e.target === this.cropperBoxRef) {
      const { edge } = this.state
      const cutterOriginX = this.cropperBoxRef.getBoundingClientRect().left
      const cutterOriginY = this.cropperBoxRef.getBoundingClientRect().top
      const pointerX = e.clientX
      const pointerY = e.clientY

      console.log(cutterOriginX, cutterOriginY, pointerX, pointerY, e.x, e.y);
      const distanceX = pointerX - cutterOriginX
      const distanceY = pointerY - cutterOriginY
      //右侧线上
      if (Math.abs(distanceX - this.cropperBoxRef.offsetWidth) < edge) {
        console.log(Math.abs(this.cropperBoxRef.offsetHeight - distanceY), edge);
        if (Math.abs(this.cropperBoxRef.offsetHeight - distanceY) < edge) {
          console.log('右下角');
          this.setState({
            mode: 'right-bottom'
          })
        } else if (Math.abs(distanceY) < edge) {
          console.log('右上角');
          this.setState({
            mode: 'right-top'
          })
        } else {
          console.log('右');
          this.setState({
            mode: 'right'
          })
        }//下侧线
      } else if (Math.abs(distanceY - this.cropperBoxRef.offsetHeight) < edge) {
        if (Math.abs(distanceX) < edge) {
          console.log('左下');
          this.setState({
            mode: 'left-bottom'
          })
        } else {
          console.log('下');
          this.setState({
            mode: 'bottom'
          })
        }//左侧线
      } else if (Math.abs(distanceX) < edge) {
        if (Math.abs(distanceY) < edge) {
          console.log('左上');
          this.setState({
            mode: 'left-top'
          })
        } else {
          console.log('左');
          this.setState({
            mode: 'left'
          })
        }//上侧线
      } else if (Math.abs(distanceY) < edge) {
        console.log('上');
        this.setState({
          mode: 'top'
        })
      }

      this.cropperContentRef.addEventListener('mousemove', this.handleContentMouseMove)
      this.cropperContentRef.addEventListener('mouseup', this.handleContentMouseUp)
    }
    e.preventDefault()
  }
  //裁剪框边缘拖拽逻辑
  handleContentMouseMove = (e) => {
    const { mode } = this.state
    const cutterOriginX = this.cropperBoxRef.getBoundingClientRect().left
    const cutterOriginY = this.cropperBoxRef.getBoundingClientRect().top
    const pointerX = e.clientX
    const pointerY = e.clientY

    const distanceX = pointerX - cutterOriginX
    const distanceY = pointerY - cutterOriginY
    const top = Number((this.cropperBoxRef.style.top || '0px').split('px')[0])
    let left = Number((this.cropperBoxRef.style.left || '0px').split('px')[0])


    console.log(distanceX, distanceY, this.cropperBoxRef.style.top);
    if (mode === 'right-bottom') {
      this.cropperBoxRef.style.width = `${distanceX}px`
      this.cropperBoxRef.style.height = `${distanceY}px`
    } else if (mode === 'right') {
      this.cropperBoxRef.style.width = `${distanceX}px`
    } else if (mode === 'right-top') {
      this.cropperBoxRef.style.top = `${top + distanceY}px`
      this.cropperBoxRef.style.width = `${distanceX}px`
      this.cropperBoxRef.style.height = `${this.cropperBoxRef.offsetHeight - distanceY}px`
    } else if (mode === 'bottom') {
      this.cropperBoxRef.style.height = `${distanceY}px`
    } else if (mode === 'left-bottom') {
      this.cropperBoxRef.style.left = `${left + distanceX}px`
      this.cropperBoxRef.style.width = `${this.cropperBoxRef.offsetWidth - distanceX}px`
      this.cropperBoxRef.style.height = `${distanceY}px`
    } else if (mode === 'left') {
      this.cropperBoxRef.style.left = `${left + distanceX}px`
      this.cropperBoxRef.style.width = `${this.cropperBoxRef.offsetWidth - distanceX}px`
    } else if (mode === 'left-top') {
      this.cropperBoxRef.style.top = `${top + distanceY}px`
      this.cropperBoxRef.style.left = `${left + distanceX}px`
      this.cropperBoxRef.style.width = `${this.cropperBoxRef.offsetWidth - distanceX}px`
      this.cropperBoxRef.style.height = `${this.cropperBoxRef.offsetHeight - distanceY}px`
    } else if (mode === 'top') {
      this.cropperBoxRef.style.top = `${top + distanceY}px`
      this.cropperBoxRef.style.height = `${this.cropperBoxRef.offsetHeight - distanceY}px`
    }


    // e.stopPropagation()
    e.preventDefault()
  }
  handleContentMouseUp = (e) => {
    this.cropperContentRef.removeEventListener('mousemove', this.handleContentMouseMove)
    this.cropperContentRef.removeEventListener('mouseup', this.handleContentMouseUp)
    this.setState({
      mode: ''
    })
  }
  //裁剪框开始内部拖拽逻辑
  handleMouseDown = (e) => {
    if (e.target === this.cropperBoxRef) {
      return
    }
    this.setState({
      pointerX: e.offsetX,
      pointerY: e.offsetY,
    })
    this.cropperBoxContentRef.addEventListener('mousemove', this.handleMouseMove)
    this.cropperBoxContentRef.addEventListener('mouseup', this.handleMouseUp)
    e.preventDefault()
  }
  //裁剪框内部拖拽逻辑
  handleMouseMove = (e) => {
    const { pointerX, pointerY } = this.state
    let left = Number((this.cropperBoxRef.style.left || '0px').split('px')[0])
    let top = Number((this.cropperBoxRef.style.top || '0px').split('px')[0])
    left = e.offsetX - pointerX + left
    top = e.offsetY - pointerY + top
    left = left < 0 ? 0 : left
    top = top < 0 ? 0 : top
    left = left > 400 - this.cropperBoxRef.offsetWidth ? 400 - this.cropperBoxRef.offsetWidth : left
    top = top > this.cropperImgRef.offsetHeight - this.cropperBoxRef.offsetHeight - 1 ? this.cropperImgRef.offsetHeight - this.cropperBoxRef.offsetHeight - 1 : top
    this.cropperBoxRef.style.left = `${left}px`
    this.cropperBoxRef.style.top = `${top}px`
    e.preventDefault()
  }
  //裁剪框结束内部拖拽逻辑
  handleMouseUp = (e) => {
    this.cropperBoxContentRef.removeEventListener('mousemove', this.handleMouseMove)
    this.cropperBoxContentRef.removeEventListener('mouseup', this.handleMouseUp)
  }

  closeDialog = () => {
    this.cropperContentRef.removeEventListener('mousedown', this.handleContentMouseDown)
    // this.cropperImgRef.removeEventListener('mousemove', this.handleImgMouseMove)
    this.cropperBoxContentRef.removeEventListener('mousedown', this.handleMouseDown)
    const originX = this.cropperBoxContentRef.getBoundingClientRect().left - this.cropperContentRef.getBoundingClientRect().left
    const originY = this.cropperBoxContentRef.getBoundingClientRect().top - this.cropperContentRef.getBoundingClientRect().top
    

    console.log('左上',originX,originY);
    console.log('右上',originX+this.cropperBoxContentRef.offsetWidth,originY);
    console.log('右下',originX+this.cropperBoxContentRef.offsetWidth,originY+this.cropperBoxContentRef.offsetHeight);
    console.log('左下',originX,originY+this.cropperBoxContentRef.offsetHeight);

    this.setState({
      visible: false
    })
  }

  render() {
    const { resetInput, visible, currentImgUrl } = this.state
    return (
      <div className="react-photo-cropper">
        <div className='cropper'>
          <label htmlFor='cropper-label-input' className='cropper-label'>
            <PlusOutlined className='cropper-label-icon' />
            添加图片
          </label>
          {resetInput && <input id='cropper-label-input' className='cropper-label-input' type='file' accept="image/*" onChange={this.imgChange} />}
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
              id='cropper-box-img'
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
            >
              <div
                id='cropper-box-cutter-content'
                className='cropper-box-cutter-content'
                style={{
                  top: '10px'
                }}
              />
            </div>
          </div>
        </Modal>
      </div >
    );
  }
}
export default ReactPhotoCropper;


// console.log(e.offsetX, e.offsetY);
// let left = Number((this.cropperBoxRef.style.left || '0px').split('px')[0])
// let top = Number((this.cropperBoxRef.style.top || '0px').split('px')[0])
// let width = e.offsetX 
// let height = e.offsetY 
// if (e.target === this.cropperContentRef) {
//   width = e.offsetX - left
//   height = e.offsetY - top
// }
// if (e.layerX > edge && e.layerX < this.cropperBoxRef.offsetWidth - edge && e.layerY < edge) {
//   console.log('上');
// } else if (e.layerX <= edge && e.layerY <= edge) {
//   console.log('左上');
// } else if (e.layerX <= edge && e.layerY <= this.cropperBoxRef.offsetHeight - edge) {
//   console.log('左');
// } else if (e.layerX <= edge && e.layerY > this.cropperBoxRef.offsetHeight - edge) {
//   console.log('左下', e.offsetY,);

//   this.cropperBoxRef.style.width = `${this.cropperBoxRef.offsetWidth - e.offsetX}px`
//   this.cropperBoxRef.style.height = `${e.offsetY}px`
//   this.cropperBoxRef.style.left = `${left + e.offsetX}px`

// } 
// else 
// if (e.layerX > edge && e.layerX <= this.cropperBoxRef.offsetWidth - edge && e.layerY > this.cropperBoxRef.offsetHeight / 2) {
//   console.log('下');
//   this.cropperBoxRef.style.height = `${height}px`
// } else if (e.layerX > this.cropperBoxRef.offsetWidth - edge && e.layerY > this.cropperBoxRef.offsetHeight - edge) {
//   console.log('右下');
//   console.log(e, width, height);
//   this.cropperBoxRef.style.width = `${width}px`
//   this.cropperBoxRef.style.height = `${height}px`
// } 
// // else if (e.layerX > this.cropperBoxRef.offsetWidth - edge && e.layerY <= edge) {
// //   console.log('右上');
// // }
//  else if (e.layerX > this.cropperBoxRef.offsetWidth / 2 && e.layerY > edge && e.layerY <= this.cropperBoxRef.offsetHeight - edge) {
//   console.log('右');
//   this.cropperBoxRef.style.width = `${width}px`
// } else {
//   console.log('其他');
// }