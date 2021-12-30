import React from 'react'

export default function ModalConfirm(props) {
    const { isOpen, toggle, onConfirm = () => {} } = props

    const handleConfirm = () => {
      onConfirm()
      toggle()
    }

    return (
        <div
            className="modal"
            style={
                isOpen
                    ? {
                          opacity: 1,
                          pointerEvents: 'auto',
                          visibility: 'visible',
                      }
                    : {}
            }
        >
            <div className="modal-box text-center">
                <h1 className="font-bold text-3xl py-8">Hapus Item ?</h1>
                <div className="modal-action">
                    <div onClick={handleConfirm} className="btn btn-primary">
                        Ya
                    </div>
                    <div onClick={toggle} className="btn btn-secondary">
                        Batal
                    </div>
                </div>
            </div>
        </div>
    )
}
