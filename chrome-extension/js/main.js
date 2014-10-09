$(function(){
    AV.initialize("tg7xkgxtxp6k1z28883mwkzv8bfriqtfot4ln8dbi01wtjmv", "vpmzwg2ttv276mk4ea7666fz0j62ov2gver8xdb47m8vigpj");
    var BigBrain = AV.Object.extend("BigBrain");

    $('#submit_comment').click(function(){
        var comment_text = $('#comment_input').val();
        if(!comment_text) {
            console.log('no comment');
            $('.alert').addClass('alert-error').html('您还没有吐槽吧~~');
            return;
        }
        var new_comment = new BigBrain();
        var url = window.location.search;
        url = url.replace('?','');
        var url_hash = $.md5(url);
        
        new_comment.save(
            {
                url: url,
                url_hash: url_hash,
                comment: comment_text
            },
            {
                success: function(obj) {
                    console.log(obj);
                    alert("AVOS Cloud works!");
                }
            }
        );

    });

    //var query = new AV.Query(BigBrain);
});