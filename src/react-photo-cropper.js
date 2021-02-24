import React, { Component } from 'react'
import { Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
class ReactPhotoCropper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: props.width,
      height: props.height,
      imgMinWidth: props.imgMinWidth || 80,
      imgMinHeight: props.imgMinHeight || 90,
      resetInput: true,
      currentImg: '',
      currentImgUrl: '',
      edge: 20,
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
        // this.cropperBoxContentRef.addEventListener('mousedown', this.handleMouseDown)
      })
    }
    reader.readAsArrayBuffer(e.target.files[0]);
  }
  handleImgMouseMove = (e) => {
    e.preventDefault()
  }
  //确定点击目标，对应绑定
  handleContentMouseDown = (e) => {
    // console.log(1,e.layerX, e.layerY);
    console.log(this.cropperBoxRef.style.width, this.cropperBoxRef.style.height);
    const { edge, imgMinWidth, imgMinHeight } = this.state
    if (e.target === this.cropperBoxRef) {
      if (this.cropperBoxRef.clientWidth <= imgMinWidth) {
        console.log(123, this.cropperBoxRef.clientWidth, this.cropperBoxRef.style.width, imgMinWidth);
        this.cropperContentRef.removeEventListener('mousemove', this.handleContentMouseMove)
        let temp = 1
        while (this.cropperBoxRef.clientWidth <= imgMinWidth + 1) {
          temp++
          this.cropperBoxRef.style.width = `${imgMinWidth + temp}px`
          console.log(123, this.cropperBoxRef.clientWidth, this.cropperBoxRef.style.width, imgMinWidth);
        }
      }
      if (this.cropperBoxRef.clientHeight <= imgMinHeight) {
        this.cropperContentRef.removeEventListener('mousemove', this.handleContentMouseMove)
        let temp = 1
        while (this.cropperBoxRef.clientHeight <= imgMinHeight + 1) {
          temp++
          this.cropperBoxRef.style.height = `${imgMinHeight + temp}px`
          console.log(123, this.cropperBoxRef.clientHeight, this.cropperBoxRef.style.height, imgMinHeight);
        }
      } 
      // if (this.cropperBoxRef.clientHeight <= imgMinHeight) {
      //   this.cropperBoxRef.style.height = `${imgMinHeight+1}px`
      // }
      this.cropperContentRef.addEventListener('mousemove', this.handleContentMouseMove)
      this.cropperContentRef.addEventListener('mouseup', this.handleContentMouseUp)
      const cutterOriginX = this.cropperBoxRef.getBoundingClientRect().left
      const cutterOriginY = this.cropperBoxRef.getBoundingClientRect().top
      const pointerX = e.clientX
      const pointerY = e.clientY

      // console.log(cutterOriginX, cutterOriginY, pointerX, pointerY, e.x, e.y);
      const distanceX = pointerX - cutterOriginX
      const distanceY = pointerY - cutterOriginY
      //右侧线上
      if (Math.abs(distanceX - this.cropperBoxRef.clientWidth) < edge) {
        console.log(Math.abs(this.cropperBoxRef.clientHeight - distanceY), edge);
        if (Math.abs(this.cropperBoxRef.clientHeight - distanceY) < edge) {
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
      } else if (Math.abs(distanceY - this.cropperBoxRef.clientHeight) < edge) {
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
    } else if (e.target === this.cropperBoxContentRef) {

      const pointerX = e.clientX
      const pointerY = e.clientY

      let left = Number((this.cropperBoxRef.style.left || '0px').split('px')[0])
      let top = Number((this.cropperBoxRef.style.top || '0px').split('px')[0])
      this.setState({
        mode: 'inside',
        pointerX,
        pointerY,
        left,
        top
      })

      this.cropperContentRef.addEventListener('mousemove', this.handleMouseMove)
      this.cropperContentRef.addEventListener('mouseup', this.handleMouseUp)
    }

    e.preventDefault()
  }
  //裁剪框边缘拖拽逻辑
  handleContentMouseMove = (e) => {
    console.log(2);
    const { mode, imgMinWidth, imgMinHeight } = this.state
    const cutterOriginX = this.cropperBoxRef.getBoundingClientRect().left
    const cutterOriginY = this.cropperBoxRef.getBoundingClientRect().top
    const pointerX = e.clientX
    const pointerY = e.clientY

    const distanceX = pointerX - cutterOriginX
    const distanceY = pointerY - cutterOriginY
    const top = Number((this.cropperBoxRef.style.top || '0px').split('px')[0])
    let left = Number((this.cropperBoxRef.style.left || '0px').split('px')[0])


    // console.log(mode,imgMinWidth, imgMinHeight);

    if (mode === 'right-bottom') {
      if (this.cropperBoxRef.clientWidth <= imgMinWidth) {
        console.log(123, this.cropperBoxRef.clientWidth, this.cropperBoxRef.style.width, imgMinWidth);
        this.cropperContentRef.removeEventListener('mousemove', this.handleContentMouseMove)
        let temp = 1
        while (this.cropperBoxRef.clientWidth <= imgMinWidth + 1) {
          temp++
          this.cropperBoxRef.style.width = `${imgMinWidth + temp}px`
          console.log(123, this.cropperBoxRef.clientWidth, this.cropperBoxRef.style.width, imgMinWidth);
        }
      } else {
        this.cropperBoxRef.style.width = `${distanceX}px`
      }
      if (this.cropperBoxRef.clientHeight <= imgMinHeight) {
        this.cropperContentRef.removeEventListener('mousemove', this.handleContentMouseMove)
        let temp = 1
        while (this.cropperBoxRef.clientHeight <= imgMinHeight + 1) {
          temp++
          this.cropperBoxRef.style.height = `${imgMinHeight + temp}px`
          console.log(123, this.cropperBoxRef.clientHeight, this.cropperBoxRef.style.height, imgMinHeight);
        }
      } else {
        this.cropperBoxRef.style.height = `${distanceY}px`
      }
    } else if (mode === 'right') {
      if (this.cropperBoxRef.clientWidth <= imgMinWidth) {
        this.cropperContentRef.removeEventListener('mousemove', this.handleContentMouseMove)
        let temp = 1
        while (this.cropperBoxRef.clientWidth <= imgMinWidth + 1) {
          temp++
          this.cropperBoxRef.style.width = `${imgMinWidth + temp}px`
          console.log(123, this.cropperBoxRef.clientWidth, this.cropperBoxRef.style.width, imgMinWidth);
        }
      } else {
        this.cropperBoxRef.style.width = `${distanceX}px`
      }
    } else if (mode === 'right-top') {
      //
      return
      if (this.cropperBoxRef.clientWidth <= imgMinWidth) {

        this.cropperBoxRef.style.width = `${imgMinWidth + 1}px`
      } else {
        this.cropperBoxRef.style.width = `${distanceX}px`
      }
      if (this.cropperBoxRef.clientHeight <= imgMinHeight) {

        this.cropperBoxRef.style.height = `${imgMinHeight + 1}px`
      } else {
        this.cropperBoxRef.style.top = `${top + distanceY}px`
        this.cropperBoxRef.style.height = `${this.cropperBoxRef.clientHeight - distanceY}px`
      }
    } else if (mode === 'bottom') {
      if (this.cropperBoxRef.clientHeight <= imgMinHeight) {
        this.cropperContentRef.removeEventListener('mousemove', this.handleContentMouseMove)
        let temp = 1
        while (this.cropperBoxRef.clientHeight <= imgMinHeight + 1) {
          temp++
          this.cropperBoxRef.style.height = `${imgMinHeight + temp}px`
          console.log(123, this.cropperBoxRef.clientHeight, this.cropperBoxRef.style.height, imgMinHeight);
        }
      } else {
        this.cropperBoxRef.style.height = `${distanceY}px`
      }
    } else if (mode === 'left-bottom') {
      //
      return
      if (this.cropperBoxRef.clientWidth <= imgMinWidth) {

        this.cropperBoxRef.style.width = `${imgMinWidth + 1}px`
      } else {
        this.cropperBoxRef.style.left = `${left + distanceX}px`
        this.cropperBoxRef.style.width = `${this.cropperBoxRef.clientWidth - distanceX}px`
      }
      if (this.cropperBoxRef.clientHeight <= imgMinHeight) {

        this.cropperBoxRef.style.height = `${imgMinHeight + 1}px`
      } else {
        this.cropperBoxRef.style.height = `${distanceY}px`
      }
    } else if (mode === 'left') {
      //
      return
      if (this.cropperBoxRef.clientWidth <= imgMinWidth) {

        this.cropperBoxRef.style.width = `${imgMinWidth + 1}px`
      } else {
        this.cropperBoxRef.style.left = `${left + distanceX}px`
        this.cropperBoxRef.style.width = `${this.cropperBoxRef.clientWidth - distanceX}px`
      }
    } else if (mode === 'left-top') {
      //
      return
      if (this.cropperBoxRef.clientHeight <= imgMinHeight) {

        this.cropperBoxRef.style.height = `${imgMinHeight + 1}px`
      } else {
        this.cropperBoxRef.style.top = `${top + distanceY}px`
        this.cropperBoxRef.style.height = `${this.cropperBoxRef.clientHeight - distanceY}px`
      }
      if (this.cropperBoxRef.clientWidth <= imgMinWidth) {

        this.cropperBoxRef.style.width = `${imgMinWidth + 1}px`
      } else {
        this.cropperBoxRef.style.left = `${left + distanceX}px`
        this.cropperBoxRef.style.width = `${this.cropperBoxRef.clientWidth - distanceX}px`
      }
    } else if (mode === 'top') {
      //
      return
      if (this.cropperBoxRef.clientHeight <= imgMinHeight) {

        this.cropperBoxRef.style.height = `${imgMinHeight + 1}px`
      } else {
        this.cropperBoxRef.style.top = `${top + distanceY}px`
        this.cropperBoxRef.style.height = `${this.cropperBoxRef.clientHeight - distanceY}px`
      }
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
  // 裁剪框开始内部拖拽逻辑
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

    let { pointerX, pointerY, mode, left, top } = this.state
    if (mode !== 'inside') { return }
    const pointerXM = e.clientX
    const pointerYM = e.clientY

    console.log(left);
    left = pointerXM - pointerX + left
    top = pointerYM - pointerY + top
    console.log(pointerXM, pointerX, pointerXM - pointerX, left);
    left = left < 0 ? 0 : left
    top = top < 0 ? 0 : top
    left = left > this.cropperImgRef.clientWidth - this.cropperBoxRef.clientWidth ? this.cropperImgRef.clientWidth - this.cropperBoxRef.clientWidth : left
    top = top > this.cropperImgRef.clientHeight - this.cropperBoxRef.clientHeight - 1 ? this.cropperImgRef.clientHeight - this.cropperBoxRef.clientHeight - 1 : top

    this.cropperBoxRef.style.left = `${left}px`
    this.cropperBoxRef.style.top = `${top}px`
    e.preventDefault()
  }
  //裁剪框结束内部拖拽逻辑
  handleMouseUp = (e) => {
    this.cropperContentRef.removeEventListener('mousemove', this.handleMouseMove)
    this.cropperContentRef.removeEventListener('mouseup', this.handleMouseUp)
  }

  closeDialog = () => {
    this.cropperContentRef.removeEventListener('mousedown', this.handleContentMouseDown)
    this.cropperBoxContentRef.removeEventListener('mousedown', this.handleMouseDown)
    const originX = this.cropperBoxContentRef.getBoundingClientRect().left - this.cropperContentRef.getBoundingClientRect().left
    const originY = this.cropperBoxContentRef.getBoundingClientRect().top - this.cropperContentRef.getBoundingClientRect().top

    const { currentImgUrl } = this.state
    const canvas = document.createElement("canvas"); //创建一个canvas节点
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = currentImgUrl
    img.onload = () => {
      // 缩小倍数
      const rateX = this.cropperImgRef.clientWidth / img.width
      const rateY = this.cropperImgRef.clientHeight / img.height
      canvas.width = this.cropperBoxContentRef.clientWidth / rateX
      canvas.height = this.cropperBoxContentRef.clientHeight / rateY
      console.log(originX, originY);
      ctx.drawImage(img, (originX - 2) / rateX, (originY - 2) / rateY, this.cropperBoxContentRef.clientWidth / rateX, this.cropperBoxContentRef.clientHeight / rateY, 0, 0, this.cropperBoxContentRef.clientWidth / rateX, this.cropperBoxContentRef.clientHeight / rateY);
      canvas.toBlob(blob => {
        console.log(blob);
        window.open(URL.createObjectURL(blob))
      })
    }


    this.setState({
      visible: false
    })
  }

  render() {
    const { resetInput, visible, currentImgUrl, width, height } = this.state
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
                maxWidth: '800px',
                width: width,
                height: height
              }}
            />
            <div
              id='cropper-box-cutter'
              className='cropper-box-cutter'
              style={{
                top: '10px',
                width: '100px',
                height: '100px'
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
// if (e.layerX > edge && e.layerX < this.cropperBoxRef.clientWidth - edge && e.layerY < edge) {
//   console.log('上');
// } else if (e.layerX <= edge && e.layerY <= edge) {
//   console.log('左上');
// } else if (e.layerX <= edge && e.layerY <= this.cropperBoxRef.clientHeight - edge) {
//   console.log('左');
// } else if (e.layerX <= edge && e.layerY > this.cropperBoxRef.clientHeight - edge) {
//   console.log('左下', e.offsetY,);

//   this.cropperBoxRef.style.width = `${this.cropperBoxRef.clientWidth - e.offsetX}px`
//   this.cropperBoxRef.style.height = `${e.offsetY}px`
//   this.cropperBoxRef.style.left = `${left + e.offsetX}px`

// } 
// else 
// if (e.layerX > edge && e.layerX <= this.cropperBoxRef.clientWidth - edge && e.layerY > this.cropperBoxRef.clientHeight / 2) {
//   console.log('下');
//   this.cropperBoxRef.style.height = `${height}px`
// } else if (e.layerX > this.cropperBoxRef.clientWidth - edge && e.layerY > this.cropperBoxRef.clientHeight - edge) {
//   console.log('右下');
//   console.log(e, width, height);
//   this.cropperBoxRef.style.width = `${width}px`
//   this.cropperBoxRef.style.height = `${height}px`
// } 
// // else if (e.layerX > this.cropperBoxRef.clientWidth - edge && e.layerY <= edge) {
// //   console.log('右上');
// // }
//  else if (e.layerX > this.cropperBoxRef.clientWidth / 2 && e.layerY > edge && e.layerY <= this.cropperBoxRef.clientHeight - edge) {
//   console.log('右');
//   this.cropperBoxRef.style.width = `${width}px`
// } else {
//   console.log('其他');
// }