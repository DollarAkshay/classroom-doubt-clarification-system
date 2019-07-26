$("document").ready(function () {

    // onsubmit validation handler for when user submits a subject
    // it checks if the subject is a valid one by making a query to the database via the server
    $("#form-subject").submit(function (e) {
        e.preventDefault()

        $.ajax({
            type: "get",
            url: `/submit/check/${$("#subject_form").val()}`
        }).done(function (isvalid) {
            if (isvalid == true) {
                $('#subject_form').addClass('is-invalid')
            } else {
                $('form').unbind('submit').submit()
            }
        });
    });

    // onsubmit validation handler for when user submits a post or link
    // it checks if the subject is a valid one by making a query to the database via the server
    $("#form-post-or-link").submit(function (e) {
        e.preventDefault()

        $.ajax({
            type: "get",
            url: `/submit/check/${$("#subject_form").val()}`
        }).done(function (isvalid) {
            if (isvalid == false) {
                $('#subject_form').addClass('is-invalid')
            } else {
                $('form').unbind('submit').submit()
            }
        });
    });
});