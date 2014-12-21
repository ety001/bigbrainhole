$(function(){
    var url = window.location.search.replace('?','');
    var title = decodeURIComponent( window.location.hash.replace('#','') );
    var url_hash = $.md5(url);

    //读取评论
    read_items(0);

    //添加评论
    $('#submit_comment').click(function(){
        $('.alert').addClass('hide').html('');
        var comment_text = $('#comment_input').val();
        if(!comment_text) {
            console.log('no comment');
            $('.alert').removeClass('hide').html('您还没有吐槽吧~~');
            return;
        }
        var new_comment = new BigBrainComments();
        
        new_comment.save(
            {
                url: url,
                url_hash: url_hash,
                comment: comment_text
            },
            {
                success: function(obj) {
                    var list_query = new AV.Query(BigBrainList);
                    list_query.equalTo('url_hash',url_hash);
                    list_query.find({
                        success: function(res) {
                            //add list
                            if(res.length==0){
                                var new_list_item = new BigBrainList();          
                                new_list_item.save(
                                    {title:title, url_hash:url_hash}
                                );
                            }
                        }
                    });
                    var html_list = '<div class="well well-small success"><h5 class="media-heading">';
                    html_list += comment_text;
                    html_list += '</h5></div>';
                    $('#list').prepend(html_list);
                    $('#comment_input').val('');
                    alert('吐槽成功');
                }
            }
        );
    });

    //获取更多
    $('#add_more').click(function(){
        read_items( parseInt($('#add_more').attr('num')) );
    });  

    function read_items(num) {
        var list_query = new AV.Query(BigBrainComments);
        var skip_num = num * item_num;
        list_query.equalTo('url_hash', url_hash);
        list_query.skip(skip_num);
        list_query.limit(item_num);
        list_query.descending('createdAt');
        list_query.find()
            .then(function(res){
                if(res.length>0) {
                    //第一次读取，并且数量等于每页的条数，则显示加载更多按钮
                    if ( num == 0 && res.length == item_num) {
                        $('#add_more').removeClass('hide');
                    }
                    var html_list = '';
                    for(var i in res) {
                        var obj = res[i];
                        html_list += '<div class="well well-small success"><h5 class="media-heading">';
                        html_list += obj.get('comment');
                        html_list += '</h5></div>';
                    }
                    $('#list').append(html_list);
                    var page_num = parseInt($('#add_more').attr('num'));
                    $('#add_more').attr('num',page_num+1);
                } else {
                    if ( num == 0 ) {
                        $('#list').prepend('<div class="well well-small success"><h5 class="media-heading">暂无吐槽</h5></div>');
                    } else {
                        $('#add_more').html('没有吐槽啦~').unbind('click');
                    }   
                }
                if(res.length<item_num) {
                    $('#add_more').html('没有吐槽啦~').unbind('click');
                }
            }
        );
    }
});