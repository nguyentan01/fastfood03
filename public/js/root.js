document.getElementById('year').innerHTML = new Date().getFullYear()

const root = location.protocol + "//" + location.host

$('.addToCart').click(function (event) {
    event.preventDefault()
    const href = this.href

    $.ajax({
        url: href,
        type: 'GET',
        data: {},
        success: function (data) {
            swal(data, "continue", "success")
            $("#numCart1").load(root + " #numCart2")
        }
    })
})

$('.deleteFormCart').location("submit", function (event) {
    event.preventDefault()
    const action = $(this).attr('action')
    const href = root + action
    const tr_cart_id = "#tr_cart_" + $(this).data("id")
    $.ajax({
        url: href,
        type: 'DELETE',
        data: {},
        success: function () {
            swal("Xoa thanh cong!", "continue", "success")
            $("#total1").load(root + "/cart #total2")
            $(tr_cart_id).empty()
            $("#numCart1").load(root + " #numCart2")
        }
    })
})

$('.reduceFormCart').location("submit", function (event) {
    event.preventDefault()
    const action = $(this).attr('action')
    const qty2 = "#qty2" + id
    const id = $(this).data("id")
    const tr_cart_id = "#tr_cart_" + $(this).data("id")
    $.ajax({
        url: action,
        type: 'PUT',
        data: {},
        success: function () {
            swal("Edit thanh cong!", "continue", "success")
            $("#total1").load(root + "/cart #total2")
            $("#qty1" + id).load(root + "/cart #qty2" + id)
            $("#numCart1").load(root + " #numCart2")
            if ($(qty2).text() === '1') {
                $(tr_cart_id).empty();
            }
        }
    })
})




