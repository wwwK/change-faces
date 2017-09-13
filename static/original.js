/* global $ */

const ZMprops = {
  platform: 'all,desktop,mac',
  siteName: 'ChangeFaces.com',
  uid: '59972107c4ff9',
  lang: 'en',
  orderUrl: 'https://store.canvaspop.com/api/pull?access_key=4db88ef881af952cca3769d2c9bd912e&image_url={url}',
  words: {
    3510: 'Delete one or more faces from canvas to make room for a new one.',
    4000: 'No',
    4001: 'Yes',
    4002: 'Cancel',
    4004: 'Apply',
    4005: 'left',
    4006: 'right',
    4009: 'center',
    4013: 'Click image for full size',
    4018: 'Bubble',
    4031: 'Flip horizontally',
    4032: 'Flip vertically',
    4033: 'Rotate left',
    4034: 'Rotate right',
    4044: 'Delete',
    4045: 'Edit text',
    4046: 'Shrink',
    4047: 'Grow',
    4056: 'Send backward',
    4058: 'Bring forward',
    4071: 'Share on social media',
    4079: 'Your image was successfully saved. Use the links below to share your image online.',
    4080: 'Direct link',
    4081: 'HTML for websites',
    4082: 'BBcode for forums',
    4084: 'Made with #1',
    4100: 'Text',
    4101: 'Type here',
    4102: 'Font',
    4103: 'Family',
    4104: 'Size',
    4105: 'Alignment',
    4107: 'Bold',
    4108: 'Underline',
    4109: 'Italics',
    4110: 'Style',
    4111: 'Double-click/tap\nto edit text...',
    4115: 'Background',
    4116: 'Color',
    4117: 'Balloon type',
    4118: 'normal',
    4119: 'bottom left',
    4120: 'top left',
    4121: 'bottom right',
    4122: 'top right',
    4134: 'You have not saved your image yet. Continue?',
    4140: 'Are you sure you want to delete this object?',
    4141: 'Are you sure you want to delete this group?',
    4142: 'Current image',
    4143: 'Save this image online',
    4144: 'History',
    4145: 'recently saved images',
    4146: 'Back',
    4178: 'You have not saved your image yet. Continue?',
    4201: 'Are you sure you want to completely delete this image?',
    4280: 'We use cookies to improve your user experience.',
    4281: 'Ok, agreed',
    4282: 'More information',
    4307: 'Your message has been sent!',
    locale: 'en_GB',
  },
  mugshots: [
    'BillMurray.jpg',
    'JustinBieber.jpg',
    'Obama.jpg',
    'VladimirPutin.jpg',
  ],
  scene: 'Abraham75926264.png',
};

var ZM = {
  dblClickTime: 0,
  scaleFactor: 1,
  canvas: null,
  spinner: null,
  scene: null,
  sceneOpacity: 0.8,
  mugshotUID: 10,
  contextMenu: null,
  contextOffset: {
    top: 0,
    left: 0,
  },
  isIdevice: /(iPad|iPhone|iPod)/g.test(navigator.userAgent),
  contentTypes: {
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    jpg: 'image/jpeg',
  },
  mayUnload: !0,
  setBusy(d) {
    d ? $('#wait').show() : $('#wait').hide();
  },
  repositionContextMenu(d) {
    const c = (d.width * d.scaleX - ZM.contextMenu.width() * ZM.scaleFactor) / 2;
    ZM.contextOffset = {
      left: (d.left - d.width / 2 * d.scaleX + c) / ZM.scaleFactor,
      top: (d.top + d.height / 2 * d.scaleY + 4) / ZM.scaleFactor,
    };
    ZM.contextMenu.css({
      left: `${ZM.contextOffset.left}px`,
      top: `${ZM.contextOffset.top}px`,
    });
  },
  showPopover(d, c, b, e) {
    e = e || {};
    b = b || 'top';
    buttons = `<button type="button" id="applyBut" class="btn btn-primary" onclick="ZM.applyTask()">${e.okLabel ? e.okLabel : lib.word(4004)}</button><button type="button" id="cancelBut" class="btn btn-danger pull-right" onclick="ZM.cancelTask()">${e.cancelLabel ? e.cancelLabel : lib.word(4002)}</button>`;
    c += `<div style="clear:both;padding-top:10px">${buttons}</div>`;
    $('#canvasPopover').popover('destroy').popover({
      container: 'body',
      placement: b,
      title: `${d}<button type="button" class="close" onclick="$('#canvasPopover').popover('destroy')">&times;</button>`,
      content: c,
      animation: !1,
      html: !0,
      trigger: 'manual',
    }).popover('show');
  },
  cancelTask() {
    $('#canvasPopover').popover('destroy');
    ZM.contextMenu.hide();
    if (typeof ZM.onCancel === 'function') { ZM.onCancel(); }
    ZM.onCancel = ZM.curTask = null;
    ZM.canvas.deactivateAll().renderAll();
  },
  applyTask() {
    if (typeof ZM.onApply === 'function') { ZM.onApply(); }
    ZM.onApply = null;
    ZM.mayUnload = !1;
  },
  showContextMenu(d, c) {
    if (c) {
      const b = [`<button type="button" class="btn btn-gray" onclick="ZM.objRemove()" title="${lib.word(4044)}"><i class="fam-trash"></i></button>`];
      switch (d.type) {
        case 'image':
          b.push(`<button type="button" class="btn btn-gray" onclick="ZM.flipObject('x')" title="${lib.word(4031)}"><i class="fam-flip-horizontal"></i></button>`, `<button type="button" class="btn btn-gray" onclick="ZM.flipObject('y')" title="${lib.word(4032)}"><i class="fam-flip-vertical"></i></button>`, `<button type="button" class="btn btn-gray" onclick="ZM.objManip('angle',-1)" title="${lib.word(4033)}"><i class="fam-rotate-left"></i></button>`, `<button type="button" class="btn btn-gray" onclick="ZM.objManip('angle',1)" title="${lib.word(4034)}"><i class="fam-rotate-right"></i></button>`);
          break;
        case 'text':
          b.push(`<button type="button" class="btn btn-gray" onclick="ZM.text()" title="${lib.word(4045)}"><i class="fam-textedit"></i></button>`);
          break;
        case 'bubblytext':
          b.push(`<button type="button" class="btn btn-gray" onclick="ZM.bubble()" title="${lib.word(4045)}"><i class="fam-textedit"></i></button>`, `<button type="button" class="btn btn-gray" onclick="ZM.objMove('bringForward')" title="${lib.word(4058)}"><i class="fam-forward"></i></button>`, `<button type="button" class="btn btn-gray" onclick="ZM.objMove('sendBackwards')" title="${lib.word(4056)}"><i class="fam-backward"></i></button>`, '<div class="btn-group btn-group-xs">', '<button type="button" class="btn btn-gray dropdown-toggle" data-toggle="dropdown">', lib.word(4117), '<span class="caret"></span>', '</button>', '<ul class="dropdown-menu">', `<li><a href="#" onclick="return ZM.setBubbleType('normal')"><i class="bubble-normal"></i> ${lib.word(4118)}</a></li>`, `<li><a href="#" onclick="return ZM.setBubbleType('speech','lb')"><i class="bubble-speech-lb"></i> ${lib.word(4119)}</a></li>`, `<li><a href="#" onclick="return ZM.setBubbleType('speech','lt')"><i class="bubble-speech-lt"></i> ${lib.word(4120)}</a></li>`, `<li><a href="#" onclick="return ZM.setBubbleType('speech','rb')"><i class="bubble-speech-rb"></i> ${lib.word(4121)}</a></li>`, `<li><a href="#" onclick="return ZM.setBubbleType('speech','rt')"><i class="bubble-speech-rt"></i> ${lib.word(4122)}</a></li>`, `<li><a href="#" onclick="return ZM.setBubbleType('thought','lb')"><i class="bubble-thought-lb"></i> ${lib.word(4119)}</a></li>`, `<li><a href="#" onclick="return ZM.setBubbleType('thought','lt')"><i class="bubble-thought-lt"></i> ${lib.word(4120)}</a></li>`, `<li><a href="#" onclick="return ZM.setBubbleType('thought','rb')"><i class="bubble-thought-rb"></i> ${lib.word(4121)}</a></li>`, `<li><a href="#" onclick="return ZM.setBubbleType('thought','rt')"><i class="bubble-thought-rt"></i> ${lib.word(4122)}</a></li>`, '</ul>', '</div>');
      }
      b.push(`<button type="button" class="btn btn-gray" onclick="ZM.objManip('resize',0.05)" title="${lib.word(4047)}"><i class="fam-grow"></i></button>`, `<button type="button" class="btn btn-gray" onclick="ZM.objManip('resize',-0.05)" title="${lib.word(4046)}"><i class="fam-shrink"></i></button>`);
      ZM.contextMenu.html(b.join('')).show();
    }
    ZM.repositionContextMenu(d);
  },
  setBubbleType(d, c) {
    const b = ZM.getActive();
    if (b === null) { return !1; }
    b.type === 'group' ? b.obj.forEachObject((e) => {
      e.type === 'bubblytext' && b.set({
        bubbleType: d,
        bubblePosition: c,
      });
    }) : b.obj.type === 'bubblytext' && b.obj.set({
      bubbleType: d,
      bubblePosition: c,
    });
    ZM.canvas.renderAll();
    return !1;
  },
  getActive() {
    let d = ZM.canvas.getActiveObject(),
      c = ZM.canvas.getActiveGroup();
    return d || c ? {
      obj: c || d,
      type: c ? 'group' : 'object',
    } : null;
  },
  flipObject(d) {
    const c = ZM.getActive();
    c !== null && (c.type === 'group' ? c.obj.forEachObject((b) => {
      b.toggle(d === 'x' ? 'flipX' : 'flipY');
    }) : (a = c.obj.angle,
        c.obj.toggle(d === 'x' ? 'flipX' : 'flipY'),
        c.obj.set('angle', 360 - a)),
        ZM.canvas.renderAll());
  },
  objManip(d, c) {
    const b = ZM.getActive();
    if (b === null) { return !1; }
    switch (d) {
      case 'resize':
        var e = b.obj.getScaleX();
        b.obj.scale(e + c);
        ZM.repositionContextMenu(b.obj);
        break;
      case 'sendBackwards':
        ZM.canvas.sendBackwards(b.obj);
        break;
      case 'sendToBack':
        ZM.canvas.sendToBack(b.obj);
        break;
      case 'bringForward':
        ZM.canvas.bringForward(b.obj);
        break;
      case 'bringToFront':
        ZM.canvas.bringToFront(b.obj);
        break;
      default:
        b.obj.set(d, b.obj.get(d) + c),
            ZM.showContextMenu(b.obj);
    }
    d !== 'left' && d !== 'top' || b.obj.setCoords();
    ZM.showObjProps(b.obj);
    ZM.canvas.renderAll();
    return !1;
  },
  objMove(d, c) {
    const b = ZM.getActive();
    if (b === null) { return !1; }
    switch (d) {
      case 'sendBackwards':
        ZM.canvas.sendBackwards(b.obj);
        break;
      case 'bringForward':
        ZM.canvas.bringForward(b.obj);
        break;
      case 'sendToBack':
        ZM.canvas.sendToBack(b.obj);
        break;
      case 'bringToFront':
        ZM.canvas.bringToFront(b.obj);
        break;
      default:
        b.obj.set(d, b.obj.get(d) + c),
            b.obj.setCoords(),
            ZM.showContextMenu(b.obj);
    }
    ZM.canvas.renderAll();
    return !1;
  },
  objRemove(d) {
    function c(b) {
      const c = b.uid;
      ZM.canvas.remove(b);
      $(`#mugshots img[data-uid="${c}"]`).removeClass('oncanvas');
    }
    function b() {
      e.type === 'group' ? (ZM.canvas.discardActiveGroup(),
            e.obj.forEachObject((b) => {
              c(b);
            })) : c(e.obj);
      ZM.canvas.deactivateAll().renderAll();
      ZM.contextMenu.hide();
    }
    var e = ZM.getActive();
    e !== null && (d ? b() : ($('#canvasPopover').popover('destroy'),
        bootbox.confirm({
          message: lib.word(e.type == 'group' ? 4141 : 4140),
          buttons: {
            cancel: {
              label: lib.word(4E3),
            },
            confirm: {
              label: lib.word(4001),
            },
          },
          callback(c) {
            c && b();
          },
        })));
  },
  addMugshot(d, c, b) {
    const e = ZM.mugshotUID++;
    $('#mugshots').prepend(`<div class="mugshot"><img data-uid="${e}" src="${d}" data-size="${c}x${b}"></div>`);
    ZM.mayUnload = !1;
  },
  canvasScale() {
    var d = ZM.canvas.getWidth(),
      c = ZM.canvas.getHeight(),
      c = d / c,
      b = $('#canvasRow').width(),
      b = Math.min(b, d),
      c = Math.round(b / c);
    $('#canvasContainer').css({
      width: `${b + 4}px`,
      height: `${c + 4}px`,
    });
    $('canvas,.canvas-container').css({
      width: '100%',
      height: '100%',
    });
    ZM.scaleFactor = d / b;
    ZM.canvas.renderAll();
    (d = ZM.canvas.getActiveObject()) && ZM.repositionContextMenu(d);
  },
  saveAs(d) {
    ZM.cancelTransparency();
    if (d == 'pdf') {
      let c = ZM.canvas.width,
        b = ZM.canvas.height,
        e,
        f;
      c > b ? (d = new jsPDF('landscape', 'mm', 'a4'),
            e = 297,
            f = b / (c / 297),
            f > 210 && (c = f / 210,
            f = 210,
            e /= c)) : (d = new jsPDF('portrait', 'mm', 'a4'),
            f = 297,
            e = c / (b / 297),
            e > 210 && (c = e / 210,
            e = 210,
            f /= c));
      d.addImage(ZM.canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8,
      }), 'JPEG', 0, 0, e, f);
      d.save('facechange.pdf');
    } else {
      const g = `facechange.${d}`;
      $('#canvas')[0].toBlob((b) => {
        saveAs(b, g);
      }, {
        png: 'image/png',
        bmp: 'image/bmp',
        jpg: 'image/jpeg',
      }[d]);
    }
    ZM.restoreTransparency();
    ZM.mayUnload = !0;
  },
  orderPrint() {
    const d = ZMprops.orderUrl;
    window.open('about:blank', 'orderPrint');
    ZM.cancelTransparency();
    let c = ZM.canvas.toDataURL({
      format: 'png',
    });
    ZM.setBusy(!0);
    $.ajax({
      type: 'POST',
      url: 'ajax.php',
      data: {
        task: 'saveLocal',
        uid: ZMprops.uid,
        img: c,
      },
      success(b) {
        ZM.setBusy(!1);
        b.success ? (c = null,
                ZM.mayUnload = !0,
                window.open(d.replace('{url}', b.data.url), 'orderPrint'),
                ZM.restoreTransparency()) : alert(b.response);
      },
    });
    return !1;
  },
  showModal(d, c, b) {
    b = b || '';
    d = ['<div class="modal-dialog">', '<div class="modal-content">', '<div class="modal-header">', '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>', `<h4 class="modal-title" id="modal-title">${d}</h4>`, '</div>', '<div class="modal-body" id="modal-body">', c, '</div>\x3c!-- /.modal-body--\x3e', '<div class="modal-footer" style="margin-top:0">', `<button type="button" class="btn btn-default" data-dismiss="modal">${lib.word(4005)}</button>`, b, '</div>', '</div>\x3c!-- /.modal-content --\x3e', '</div>\x3c!-- /.modal-dialog --\x3e'];
    $('#myModal').html(d.join('')).modal();
  },
  imgurDetails(d, c) {
    d = d.split('?')[0];
    const b = [];
    c && b.push(`<div class="alert alert-success">${c}</div>`);
    b.push(`<h4>${lib.word(4080)}</h4>`, '<div class="input-group">', '<input type="text" spellcheck="false" class="form-control">', '<div class="input-group-addon"><a href="#" target="_blank" id="extLink"><i class="fa fa-external-link"></i></a></div>', '</div>', `<h4>${lib.word(4081)}</h4>`, '<input type="text" spellcheck="false" class="form-control">', `<h4>${lib.word(4082)}</h4>`, '<input type="text" spellcheck="false" class="form-control">', `<h4>${lib.word(4071)}</h4><div id="addThis"></div>`);
    $('#modal-body').html(b.join(''));
    $.ajax({
      type: 'POST',
      url: 'ajax.php',
      data: {
        task: 'getLocalLink',
        url: d,
      },
      success(b) {
        if (b.success) {
          b = b.data.localLink;
          const c = lib.word(4084, ZMprops.siteName);
          $('.modal-body input').on('click', function () {
            this.focus();
            this.select();
          }).eq(0).val(d).end().eq(1).val(`<a href="${b}" target="_blank"><img src="${d}" border="0" alt="${c}"/></a>`).end().eq(2).val(`[URL=${b}][IMG]${d}[/IMG][/URL]`);
          $('#extLink').prop('href', d);
          $('#addThis').html(`<iframe src="/modals/addthis.php?url=${escape(b)}&amp;title=${escape(c)}" width="100%" height="50" frameborder="0"></iframe>`);
        } else { alert(b.response); }
      },
    });
  },
  canvasSaveOnline() {
    ZM.cancelTransparency();
    $('#myModal').one('hidden.bs.modal', () => {
      ZM.restoreTransparency();
    }).modal({
      remote: '/modals/save-image.php',
    });
    return !1;
  },
  emailImage(d, c) {
    if (d) {
      $('#sendBut').prop('disabled', !0);
      $('.inputError').remove();
      const b = $(c).serializeArray();
      b.push({
        name: 'task',
        value: 'sendImage',
      }, {
        name: 'uid',
        value: ZMprops.uid,
      }, {
        name: 'img',
        value: ZM.canvas.toDataURL({
          format: 'jpeg',
          quality: 0.8,
        }),
      });
      ZM.setBusy(!0);
      $.ajax({
        type: 'POST',
        url: 'ajax.php',
        data: b,
        dataType: 'json',
        success(b) {
          ZM.setBusy(!1);
          if (b.response) { alert(b.response); } else {
            let c = !1,
              d = 0,
              e;
            for (e in b.data) {
              c = !0,
                            $el = $(`:input[name='${e}']`),
                            $el.before(`<div class="inputError">${b.data[e]}</div>`),
                            d++ == 0 && $el.focus();
            }
            c ? $('#sendBut').prop('disabled', !1) : ($('#sendBut').hide(),
                        $('#modal-body').html(lib.word(4307)));
          }
        },
      });
      return !1;
    }
    ZM.canvas.deactivateAll();
    ZM.sceneOpacity = 1;
    ZM.scene.fabricImg.set('opacity', 1);
    ZM.canvas.renderAll();
    $('#sceneOpacity').val(100 * ZM.sceneOpacity).change();
    $('#myModal').modal({
      remote: '/modals/email-image.php',
    });
  },
  showObjProps(d) {
    let c = Math.round(d.angle);
    c >= 360 && (c -= 360);
    $('#objProps').show().html(`${Math.round(d.left)},${Math.round(d.top)} | ${Math.round(d.width * d.scaleX)}x${Math.round(d.height * d.scaleY)} | ${c}&deg;`);
  },
  bubble() {
    function d() {
      let c = ZM.canvas.getActiveObject();
      c && c.type !== 'bubblytext' && (c = null);
      let d,
        e = {
          bubbleType: b.bubbleType,
          bubblePosition: b.bubblePosition,
          fontFamily: b.fontFamily,
          fill: b.fontColor,
          bubbleColor: b.bubbleColor,
          textAlign: b.textAlign,
          fontWeight: b.isBold ? 'bold' : '',
          textDecoration: b.isUnderline ? 'underline' : '',
          fontStyle: b.isItalic ? 'italic' : '',
          lineHeight: 1.1,
          renderAboveOverlay: !0,
        };
      if (c) {
        if (b.text === '') { ZM.canvas.remove(c); } else {
          for (d in e.text = b.text,
                    e) { c.set(d, e[d]); }
        }
        ZM.canvas.renderAll();
      } else {
        b.text !== '' && (e.left = ZM.canvas.getWidth() / 2,
                e.top = ZM.canvas.getHeight() / 2,
                c = new fabric.Bubblytext(b.text, e),
                ZM.canvas.add(c),
                ZM.canvas.setActiveObject(c));
      }
    }
    var c = ZM.canvas.getActiveObject();
    c && c.type !== 'bubblytext' && (c = null);
    var b = {
      bubbleType: c ? c.bubbleType : 'speech',
      bubblePosition: c ? c.bubblePosition : 'lb',
      fontFamily: c ? c.fontFamily : ZM.isIdevice ? 'Marker Felt' : 'Comic Sans MS',
      fontColor: c ? c.fill : 'black',
      bubbleColor: c ? c.bubbleColor : 'white',
      textAlign: c ? c.textAlign : 'left',
      text: c ? c.text : '',
      isBold: c ? c.fontWeight === 'bold' : !1,
      isUnderline: c ? /underline/.test(c.textDecoration) : !1,
      isItalic: c ? c.fontStyle === 'italic' : !1,
    };
    ZM.onApply = function () {
      ZM.cancelTask();
    }
        ;
    var c = '',
      e,
      f = (`${ZM.isIdevice ? 'Marker Felt' : 'Comic Sans MS'},Helvetica,Arial,Arial Black,Tahoma,Trebuchet MS,Verdana,Courier New,Georgia,Times New Roman`).split(',');
    for (e = 0; e < f.length; e++) { c += `<option value="${f[e]}" style="font-family:${f[e]}">${f[e]}</option>`; }
    c = ['<div style="margin-bottom:10px">', '<div class="btn-group">', '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">', `${lib.word(4117)} <span class="caret"></span>`, '</button>', '<ul class="dropdown-menu">', `<li><a href="#" data-bubble="normal"><i class="bubble-normal"></i> ${lib.word(4118)}</a></li>`, `<li><a href="#" data-bubble="speech-lb"><i class="bubble-speech-lb"></i> ${lib.word(4119)}</a></li>`, `<li><a href="#" data-bubble="speech-lt"><i class="bubble-speech-lt"></i> ${lib.word(4120)}</a></li>`, `<li><a href="#" data-bubble="speech-rb"><i class="bubble-speech-rb"></i> ${lib.word(4121)}</a></li>`, `<li><a href="#" data-bubble="speech-rt"><i class="bubble-speech-rt"></i> ${lib.word(4122)}</a></li>`, `<li><a href="#" data-bubble="thought-lb"><i class="bubble-thought-lb"></i> ${lib.word(4119)}</a></li>`, `<li><a href="#" data-bubble="thought-lt"><i class="bubble-thought-lt"></i> ${lib.word(4120)}</a></li>`, `<li><a href="#" data-bubble="thought-rb"><i class="bubble-thought-rb"></i> ${lib.word(4121)}</a></li>`, `<li><a href="#" data-bubble="thought-rg"><i class="bubble-thought-rt"></i> ${lib.word(4122)}</a></li>`, '</ul>', '</div>', '</div>', `<b>${lib.word(4100)}</b>`, `<textarea class="form-control" id="text" style="width:100%;margin-bottom:10px" placeholder="${lib.word(4101)}"></textarea>`, `<b>${lib.word(4102)}</b>`, '<div class="iptBox"><table cellpadding="3">', `<tr><td>${lib.word(4103)}:</td><td><select id="fontFamily" class="form-control">${c}</select></td></tr>`, `<tr><td>${lib.word(4105)}:</td><td>`, `<input type="radio" id="align1" name="align" value="left"><label for="align1">${lib.word(4005)}</label>`, `<input type="radio" id="align2" name="align" value="center"><label for="align2">${lib.word(4009)}</label>`, `<input type="radio" id="align3" name="align" value="right"><label for="align3">${lib.word(4006)}</label>`, '</td></tr>', '<tr>', `<td>${lib.word(4110)}:</td><td>`, `<input id="bold" type="checkbox"><label for="bold">${lib.word(4107)}</label>`, `<input id="underline" type="checkbox"><label for="underline">${lib.word(4108)}</label>`, `<input id="italic" type="checkbox"><label for="italic">${lib.word(4109)}</label>`, '</td>', '</tr><tr>', `<td>${lib.word(4116)}:</td>`, `<td>${lib.word(4100)}: <div class="colorBox" id="textColor" style="background:black"><div></div></div> ${lib.word(4115)}: <div class="colorBox" id="backgroundColor"><div></div></div></td>`, '</tr>', '</table></div>'];
    ZM.showPopover(lib.word(4018), c.join(''));
    $('a[data-bubble]').on('click', function () {
      const c = $(this).data('bubble').split('-');
      b.bubbleType = c[0];
      c[1] && (b.bubblePosition = c[1]);
      d();
      $('[data-toggle="dropdown"]').parent().removeClass('open');
      return !1;
    });
    $('#text').val(b.text).on('keyup', function () {
      b.text = $.trim(this.value);
      d();
    }).focus();
    $('#fontFamily').val(b.fontFamily).on('change', function () {
      b.fontFamily = this.value;
      d();
    });
    $("input[name='align']").on('click', function () {
      b.textAlign = this.value;
      d();
    }).filter(`[value='${b.textAlign}']`).prop('checked', !0);
    $('#bold').on('click', function () {
      b.isBold = this.checked;
      d();
    }).prop('checked', b.isBold);
    $('#underline').on('click', function () {
      b.isUnderline = this.checked;
      d();
    }).prop('checked', b.isUnderline);
    $('#italic').on('click', function () {
      b.isItalic = this.checked;
      d();
    }).prop('checked', b.isItalic);
    $('#textColor').css('background', b.fontColor).ColorPicker({
      hasTransparent: !1,
      onChange(c, e) {
        $(this).css('background', e);
        b.fontColor = c;
        d();
      },
    });
    $('#backgroundColor').css('background', b.bubbleColor).ColorPicker({
      hasTransparent: !1,
      onChange(c, e) {
        $(this).css('background', e);
        b.bubbleColor = c;
        d();
      },
    });
  },
  text() {
    function d() {
      let c = ZM.canvas.getActiveObject();
      c && c.type != 'text' && (c = null);
      let d,
        e = {
          fontFamily: b.fontFamily,
          fontSize: b.fontSize,
          fill: b.fontColor,
          backgroundColor: b.backgroundColor,
          textAlign: b.textAlign,
          fontWeight: b.isBold ? 'bold' : '',
          textDecoration: b.isUnderline ? 'underline' : '',
          fontStyle: b.isItalic ? 'italic' : '',
          renderAboveOverlay: !0,
        };
      if (c) {
        if (b.text === '') { ZM.canvas.remove(c); } else {
          for (d in e.text = b.text,
                    e) { c.set(d, e[d]); }
        }
        ZM.canvas.renderAll();
      } else {
        b.text !== '' && (e.left = ZM.canvas.getWidth() / 2,
                e.top = ZM.canvas.getHeight() / 2,
                c = new fabric.Text(b.text, e),
                ZM.canvas.add(c),
                ZM.canvas.setActiveObject(c));
      }
    }
    var c = ZM.canvas.getActiveObject();
    c && c.type != 'text' && (c = null);
    var b = {
      text: c ? c.text : '',
      fontFamily: c ? c.fontFamily : 'Helvetica',
      fontSize: c ? c.fontSize : 32,
      fontColor: c ? c.fill : 'black',
      backgroundColor: c ? c.backgroundColor : 'transparent',
      textAlign: c ? c.textAlign : 'left',
      isBold: c ? c.fontWeight === 'bold' : !1,
      isUnderline: c ? /underline/.test(c.textDecoration) : !1,
      isItalic: c ? c.fontStyle === 'italic' : !1,
    };
    ZM.onApply = function () {
      ZM.cancelTask();
    }
        ;
    var c = '',
      e,
      f = 'Helvetica;Arial;Arial Black;Tahoma;Trebuchet MS;Verdana;Courier New;Georgia;Times New Roman'.split(';');
    for (e = 0; e < f.length; e++) { c += `<option value="${f[e]}" style="font-family:${f[e]}">${f[e]}</option>`; }
    c = [`<b>${lib.word(4100)}</b>`, `<textarea class="form-control" id="text" style="width:100%;margin-bottom:10px" placeholder="${lib.word(4101)}"></textarea>`, `<b>${lib.word(4102)}</b>`, '<div class="iptBox"><table cellpadding="3">', `<tr><td>${lib.word(4103)}:</td><td><select id="fontFamily" class="form-control">${c}</select></td></tr>`, `<tr><td>${lib.word(4104)}:</td><td style="padding:15px 0"><input id="fontSizeSlider" type="range" min="8" max="72"></td></tr>`, `<tr><td>${lib.word(4105)}:</td><td>`, `<input type="radio" id="align1" name="align" value="left"><label for="align1">${lib.word(4005)}</label>`, `<input type="radio" id="align2" name="align" value="center"><label for="align2">${lib.word(4009)}</label>`, `<input type="radio" id="align3" name="align" value="right"><label for="align3">${lib.word(4006)}</label>`, '</td></tr>', '<tr>', `<td>${lib.word(4110)}:</td><td>`, `<input id="bold" type="checkbox"><label for="bold">${lib.word(4107)}</label>`, `<input id="underline" type="checkbox"><label for="underline">${lib.word(4108)}</label>`, `<input id="italic" type="checkbox"><label for="italic">${lib.word(4109)}</label>`, '</td>', '</tr><tr>', `<td>${lib.word(4116)}:</td>`, `<td>${lib.word(4100)}: <div class="colorBox" id="textColor" style="background:black"><div></div></div> ${lib.word(4115)}: <div class="colorBox" id="backgroundColor"><div></div></div></td>`, '</tr>', '</table></div>'];
    ZM.showPopover(lib.word(4100), c.join(''));
    $('#text').val(b.text).on('keyup', function () {
      b.text = $.trim(this.value);
      d();
    }).focus();
    $('#fontFamily').val(b.fontFamily).on('change', function () {
      b.fontFamily = this.value;
      d();
    });
    $("input[name='align']").on('click', function () {
      b.textAlign = this.value;
      d();
    }).filter(`[value='${b.textAlign}']`).prop('checked', !0);
    $('#bold').on('click', function () {
      b.isBold = this.checked;
      d();
    }).prop('checked', b.isBold);
    $('#underline').on('click', function () {
      b.isUnderline = this.checked;
      d();
    }).prop('checked', b.isUnderline);
    $('#italic').on('click', function () {
      b.isItalic = this.checked;
      d();
    }).prop('checked', b.isItalic);
    $('#fontSizeSlider').val(b.fontSize).rangeslider({
      polyfill: !1,
      onSlide(c, e) {
        b.fontSize = e;
        d();
      },
    });
    $('#textColor').css('background', b.fontColor).ColorPicker({
      hasTransparent: !1,
      onChange(c, e) {
        $(this).css('background', e);
        b.fontColor = c;
        d();
      },
    });
    c = b.backgroundColor;
    $('#backgroundColor').css('background', c === 'transparent' ? '' : c).ColorPicker({
      onChange(c, e) {
        $(this).css('background', e);
        b.backgroundColor = c;
        d();
      },
    });
  },
  cancelTransparency() {
    ZM.contextMenu.hide();
    ZM.canvas.deactivateAll();
    ZM.oldSceneOpacity = ZM.sceneOpacity;
    ZM.scene.fabricImg.set('opacity', 1);
    ZM.canvas.renderAll();
  },
  restoreTransparency() {
    ZM.sceneOpacity = ZM.oldSceneOpacity;
    delete ZM.oldSceneOpacity;
    ZM.scene.fabricImg.set('opacity', ZM.sceneOpacity);
    ZM.canvas.renderAll();
  },
  printCanvas() {
    ZM.cancelTransparency();
    const d = new Image();
    d.onload = function () {
      let c = fabric.util.createCanvasElement();
      c.width = this.height;
      c.height = this.width;
      let b = c.getContext('2d');
      b.translate(c.width / 2, c.height / 2);
      b.rotate(90 * Math.PI / 180);
      b.drawImage(this, -this.width / 2, -this.height / 2);
      c = c.toDataURL('image/png');
      b = $('#printFrame')[0].contentWindow;
      b.document.open();
      b.document.write(`<html><body onload="this.focus();window.print()"><img src="${c}" width="100%"></body></html>`);
      b.document.close();
    }
        ;
    d.src = $('#canvas')[0].toDataURL('image/png');
    ZM.restoreTransparency();
    return !1;
  },
  editResult(d) {
    if (d) {
      return window.open(ZM.editUrl),
            !1;
    }
    ZM.cancelTransparency();
    d = [{
      name: 'task',
      value: 'editImage',
    }, {
      name: 'uid',
      value: ZMprops.uid,
    }, {
      name: 'img',
      value: ZM.canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8,
      }),
    }];
    ZM.restoreTransparency();
    ZM.setBusy(!0);
    $.ajax({
      type: 'POST',
      url: 'ajax.php',
      data: d,
      dataType: 'json',
      success(c) {
        ZM.setBusy(!1);
        c.response ? alert(c.response) : (ZM.editUrl = c.data.url,
                $('#canvasPopover').popover('destroy'),
                $('#myModal').load('/modals/edit-result.php', function () {
                  $(this).modal();
                }));
      },
    });
  },
  upload() {
    $('#canvasPopover').popover('destroy');
    $('#myModal').load('/modals/upload.php', function () {
      $(this).modal();
    });
  },
  webcam() {
    $('#canvasPopover').popover('destroy');
    $('#myModal').load('/modals/webcam.php', function () {
      $(this).modal();
    });
  },
  init() {
    function d() {
      const b = ZM.getActive();
      b !== null && ZM.showContextMenu(b.obj, !0);
    }
    $("a[href='#']").attr('href', 'javascript://');
    bootbox.setLocale(lib.word('locale').substr(0, 2));
    $('#myModal').on('hidden.bs.modal', function () {
      $(this).removeData('bs.modal').find('.modal-content').empty();
    });
    $('#sceneOpacity').val(100 * ZM.sceneOpacity).rangeslider({
      polyfill: !1,
      onSlide(b, c) {
        ZM.sceneOpacity = c / 100;
        ZM.scene.fabricImg.set('opacity', ZM.sceneOpacity);
        ZM.canvas.renderAll();
      },
    });
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    fabric.Object.prototype.cornerColor = 'yellow';
    fabric.Object.prototype.borderColor = 'red';
    fabric.Object.prototype.cornerSize = 16;
    ZM.canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: !0,
      enableRetinaScaling: !1,
      stopContextMenu: !0,
    });
    ZM.canvas.controlsAboveOverlay = !0;
    ZM.contextMenu = $('#contextMenu');
    const c = $('#scenes img:first');
    fabric.Image.fromURL(c.data('src'), (b) => {
      ZM.scene = {
        $img: c,
        fabricImg: b,
      };
      b.set({
        originX: 'left',
        originY: 'top',
        opacity: ZM.sceneOpacity,
      });
      ZM.canvas.setWidth(b.width).setHeight(b.height);
      ZM.canvas.setOverlayImage(b, ZM.canvasScale);
    });
    fabric.Image.fromURL(`/mugshots/${ZMprops.mugshots[0]}`, (b) => {
      b.scale(0.4).setCoords();
      b.set({
        uid: 0,
        left: 836,
        top: 195,
      });
      ZM.canvas.add(b);
      ZM.canvas.setActiveObject(b);
      ZM.showObjProps(b);
    });
    $('#mugshots img[data-uid="0"]').addClass('oncanvas');
    ZM.canvasScale();
    $(window).on('resize', ZM.canvasScale).on('beforeunload', () => {
      if (!ZM.mayUnload) { return lib.word(4134); }
    });
    ZM.canvas.on({
      'selection:cleared': function (b) {
        $('#canvasPopover').popover('destroy');
        ZM.contextMenu.hide();
      },
      'selection:created': function (b) {
        d();
      },
      'object:moving': function (b) {
        ZM.showObjProps(b.target);
        d();
      },
      'object:scaling': function (b) {
        ZM.showObjProps(b.target);
        d();
      },
      'object:selected': function (b) {
        b = b.target;
        ZM.showContextMenu(b, !0);
        ZM.showObjProps(b);
      },
      'object:rotating': function (b) {
        ZM.showObjProps(b.target);
      },
      'object:removed': function (b) {
        $('#objProps').hide();
      },
      'mouse:down': function (b) {
        let c = ZM.getActive(),
          d = (new Date()).getTime();
        if (c !== null) {
          return d - ZM.dblClickTime < 400 ? (b.e.preventDefault(),
                    b.e.stopPropagation(),
                    c.obj.type == 'bubblytext' ? ZM.bubble() : c.obj.type == 'text' && ZM.text()) : ZM.showContextMenu(c.obj),
                    ZM.dblClickTime = d,
                    !1;
        }
      },
    });
    $('#bubbles img').on('click', function () {
      ZM.addBubble(this.src);
    });
    $('div.scene img').on('click', function () {
      function b(c) {
        var d = g[c].split(' '),
          e = d[0].split(','),
          f = +e[0],
          k = +e[1],
          e = d[1].split('x'),
          l = +e[0],
          q = +e[1],
          r = +d[2],
          m = h[c],
          d = $(`#mugshots img[data-uid="${m}"]`),
          n = d.attr('src'),
          d = d.data('size').split('x'),
          t = +d[0],
          u = +d[1];
        fabric.Image.fromURL(n, (d) => {
          d.set({
            url: n,
            uid: m,
            left: f,
            top: k,
            angle: r,
            originX: 'center',
            originY: 'center',
            scaleX: l / t,
            scaleY: q / u,
          }).setCoords();
          ZM.canvas.add(d);
          c == 0 && (ZM.showObjProps(d),
                    ZM.canvas.setActiveObject(d));
          $(`#mugshots img[data-uid="${m}"]`).addClass('oncanvas');
          c < h.length - 1 && c < g.length - 1 ? b(c + 1) : ZM.canvas.renderAll();
        });
      }
      var c = $(this),
        d = c.data('size').split('x'),
        g = c.data('holes'),
        l = d[0],
        d = d[1],
        h = [];
      ZM.canvas.forEachObject((b) => {
        b.type == 'image' && (h.push(b.uid),
                $(`#mugshots img[data-uid="${b.uid}"]`).removeClass('oncanvas'),
                b.remove());
      });
      ZM.canvas.setWidth(l).setHeight(d);
      ZM.canvasScale();
      fabric.Image.fromURL(c.data('src'), (d) => {
        ZM.scene = {
          $img: c,
          fabricImg: d,
        };
        d.set({
          originX: 'left',
          originY: 'top',
          opacity: ZM.sceneOpacity,
        });
        ZM.canvas.setOverlayImage(d, () => {
          h.length > 0 ? b(0) : ZM.canvas.renderAll();
        });
      });
    });
    $('#mugshots').on('click', 'div.mugshot img', function (b) {
      const c = [];
      b = ZM.scene.$img.data('holes');
      var d = [],
        g = ZM.getActive();
      g !== null && g.type == 'object' && g.obj.type == 'image' && (ZM.objRemove(!0),
            g = null);
      ZM.canvas.forEachObject((b) => {
        b.type == 'image' && c.push({
          uid: b.uid,
          left: b.left,
          top: b.top,
          width: b.width * b.scaleX,
          height: b.height * b.scaleY,
          angle: b.angle,
        });
      });
      if (g === null && c.length >= ZM.scene.$img.data('holes').length) { bootbox.alert(lib.word(3510)); } else {
        for (g = 0; g < b.length; g++) {
          for (var l = b[g].split(' '), h = l[0].split(','), k = +h[0], v = +h[1], h = l[1].split('x'), w = +h[0], h = +h[1], l = +l[2], y = 0, x = 0; x < c.length; x++) {
            const p = c[x];
            p.left >= k - w / 2 && p.left <= k + w / 2 && p.top >= v - h / 2 && p.top <= v + h / 2 || y++;
          }
          y == c.length && d.push({
            left: k,
            top: v,
            width: w,
            height: h,
            angle: l,
          });
        }
        const q = $(this).data('uid');
        b = $(this).attr('src');
        var k = $(this).data('size').split('x'),
          g = +k[0],
          k = +k[1],
          r = ZM.canvas.getWidth() / 2,
          m = ZM.canvas.getHeight() / 2,
          n = 0,
          t = 1,
          u = 1;
        d.length > 0 && (r = d[0].left,
                m = d[0].top,
                t = d[0].width / g,
                u = d[0].height / k,
                n = d[0].angle);
        fabric.Image.fromURL(b, (b) => {
          b.set({
            uid: q,
            left: r,
            top: m,
            angle: n,
            originX: 'center',
            originY: 'center',
            scaleX: t,
            scaleY: u,
          });
          d.length == 0 && b.scaleToHeight(200);
          ZM.canvas.add(b).setActiveObject(b).renderAll();
          $(`#mugshots img[data-uid="${q}"]`).addClass('oncanvas');
        });
      }
    });
    document.onkeydown = function (b) {
      if ($('.popover:visible,.modal:visible').length > 0) { return !0; }
      switch (window.event ? window.event.keyCode : b.keyCode) {
        case 37:
          return b.ctrlKey || b.metaKey ? ZM.objManip('angle', -1) : ZM.objManip('left', -1);
        case 39:
          return b.ctrlKey || b.metaKey ? ZM.objManip('angle', 1) : ZM.objManip('left', 1);
        case 38:
          return b.ctrlKey || b.metaKey ? !0 : ZM.objManip('top', -1);
        case 40:
          return b.ctrlKey || b.metaKey ? !0 : ZM.objManip('top', 1);
        case 46:
          return ZM.objRemove(),
                !1;
        case 27:
          return ZM.canvas.deactivateAll().renderAll(),
                $('#canvasPopover').popover('destroy'),
                ZM.contextMenu.hide(),
                $('#objProps').hide(),
                !1;
        case 80:
          return b.ctrlKey || b.metaKey ? (b.preventDefault(),
                ZM.printCanvas(),
                !1) : !0;
        case 83:
          return b.ctrlKey || b.metaKey ? (b.preventDefault(),
                ZM.saveAs('jpg'),
                !1) : !0;
      }
    }
        ;
    $('.btn-save').on('click', function (b) {
      ZM.saveAs($(this).data('format'));
      $('[data-toggle="dropdown"]').parent().removeClass('open');
      return !1;
    });
    ZM.spinner = (new Spinner({
      length: 28,
      width: 14,
      radius: 42,
      color: '#fff',
    })).spin($('#wait')[0]);
    cookieChoices.showCookieConsent(lib.word(4280), lib.word(4281), lib.word(4282), '/disclaimer/');
  },
};
