export class Toast {
    static success(message) {
        Toastify({
            text: message,
            duration: 4000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #061700, #0f9b0f)",
            },
        }).showToast()
    }

    static erro(message) {
        Toastify({
            text: message,
            duration: 2000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #F00000, #DC281E)",
            },
        }).showToast()
    }
}