var docTitle = document.title.replace(/^\([0-9]+\) /, ""),
    headTag = document.getElementsByTagName('head')[0],
    reloadBtn = document.getElementById('reload-list'),
    listContainer = document.getElementById('comment-list'),
    domain = 'https://' + window.location.hostname,
    totalFeed = window.location.search ? parseInt(window.location.search.substr(14), 10) : 1,
    numRecentComments = totalFeed,
    numPerPost = totalFeed,
    maxCommentChars = 99999,
    maxPostTitleChars = 0,
    txtMore = 'Read more',
    txtVars = '[title] - [date MM/dd/yy hh:mm]',
    txtAnonymous = '',
    trueAvatars = true;
var urlMyAvatar = 'http://1.bp.blogspot.com/-O5uDCfQAOuo/XGxlrzKveiI/AAAAAAAAIqk/6MInfzWAZ40Bkm_IhCLSMab5TZWXmml6ACK4BGAYYCw/s1600/ava.png',
    urlMyProfile = 'https://www.blogger.com/profile/07846603580605750971',
    urlAnoAvatar = 'http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&s=16',
    maxResultsPosts = "&max-results=99999",
    maxResultsComments = "&max-results=" + totalFeed,
    urlToTitle = {};

function replaceVars(a, b, c, d) {
    a = txtVars.replace('[user]', b).replace('[date]', d.toLocaleDateString()).replace('[datetime]', d.toLocaleString()).replace('[time]', d.toLocaleTimeString()).replace('[title]', c.replace(/\"/g, '&quot;'));
    var i = a.indexOf("[date ");
    if (i > -1) {
        var e = /\[date\s+(.+?)\]/.exec(a)[1];
        if (e != '') {
            var f = e.replace(/yyyy/i, d.getFullYear());
            f = f.replace(/yy/i, d.getFullYear().toString().slice(-2)).replace("MM", String("0" + (d.getMonth() + 1)).slice(-2)).replace("mm", String("0" + d.getMinutes()).slice(-2)).replace("ss", String("0" + d.getSeconds()).slice(-2)).replace("dd", String("0" + d.getDate()).slice(-2)).replace("hh", String("0" + d.getHours()).slice(-2));
            a = a.replace(/\[date\s+(.+?)\]/, f)
        }
    }
    return a
}
if (urlMyProfile == "") {
    var elements = document.getElementsByTagName("*"),
        expr = /(^| )profile-link( |$)/;
    for (var i = 0; i < elements.length; i++)
        if (expr.test(elements[i].className)) {
            urlMyProfile = elements[i].href;
            break
        }
}

function getPostUrlsForComments(a) {
    for (var i = 0; i < a.feed.entry.length; i++) {
        var b = a.feed.entry[i],
            href;
        for (var k = 0; k < b.link.length; k++) {
            if (b.link[k].rel == 'alternate') {
                href = b.link[k].href;
                break
            }
        }
        urlToTitle[href] = b.title.$t
    }
}

function showRecentComments(a) {
    var b = {}, j = 0;
    if (numPerPost) {
        while (numPerPost < numRecentComments) {
            for (var i = 0; i < a.feed.entry.length; i++) {
                var c = a.feed.entry[i];
                if (c["thr$in-reply-to"]) {
                    if (!b[c["thr$in-reply-to"].href]) {
                        b[c["thr$in-reply-to"].href] = 1
                    } else {
                        b[c["thr$in-reply-to"].href]++
                    } if (b[c["thr$in-reply-to"].href] <= numPerPost) {
                        j++
                    }
                }
            }
            if (j >= numRecentComments) break;
            numPerPost++;
            j = 0;
            b = {}
        }
        if (numRecentComments == numPerPost) numPerPost = 0
    }
    b = {};
    var d = "";
    j = 0;
    for (var i = 0; j < numRecentComments && i < a.feed.entry.length; i++) {
        var c = a.feed.entry[i];
        if (numPerPost && b[c["thr$in-reply-to"].href] && b[c["thr$in-reply-to"].href] >= numPerPost) continue;
        if (c["thr$in-reply-to"]) {
            if (!b[c["thr$in-reply-to"].href]) b[c["thr$in-reply-to"].href] = 1;
            else b[c["thr$in-reply-to"].href]++;
            j++;
            var e = '';
            for (var k = 0; k < c.link.length; k++) {
                if (c.link[k].rel == 'alternate') {
                    e = c.link[k].href;
                    break
                }
            }
            if (e == '') {
                j--;
                continue
            }
            var f, hrefPost = e.split("?")[0],
                part1 = hrefPost.lastIndexOf('/') + 1,
                part2 = e.lastIndexOf('.html');
            comment = ("content" in c) ? c.content.$t : c.summary.$t;
            if (urlToTitle[hrefPost]) {
                f = urlToTitle[hrefPost]
            } else {
                f = hrefPost.substring(part1, part2);
                f = f.replace(/-/g, " ");
                f = f[0].toUpperCase() + f.slice(1)
            } if (maxPostTitleChars && f.length > maxPostTitleChars) {
                f = f.substring(0, maxPostTitleChars);
                var g = f.lastIndexOf(" ");
                f = f.substring(0, g) + "..."
            }
            var h = c.author[0].name.$t;
            var l = "";
            if (c.author[0].uri && c.author[0].uri.$t != "") l = c.author[0].uri.$t;
            var m = urlAnoAvatar;
            var n = "https://www.blogger.com/profile/";
            if (trueAvatars && l.substr(0, n.length) == n) {
                m = c.author[0].gd$image.src
            } else {
                var o = document.createElement('a');
                if (l != "") {
                    o.href = l;
                    m = 'https://www.google.com/s2/favicons?domain=' + o.hostname
                }
            }
            m = m.replace(/\/s[0-9]+/, "/s50").replace(/s(.*?)\/favicons/, "s2\/favicons");
            if (l == urlMyProfile && urlMyAvatar != "") m = urlMyAvatar;
            if (h == 'Anonymous' && txtAnonymous != '' && m == urlAnoAvatar) h = txtAnonymous;
            if (l != "") imgcode = '<a href="' + l + '"><img title="' + h + '" src="' + m + '"></a>';
            var p = "";
            if (h == 'Vio pupu' || h == 'Menjalani Kehidupan Menuju Kematian') p = " admin";
            var q = c.published.$t.match(/\d+/g),
                cmtDate = new Date(q[0], q[1] - 1, q[2], q[3], q[4], q[5]),
                tooltip = replaceVars(txtVars, h, f, cmtDate),
                txtHeader = replaceVars(txtHeader, h, f, cmtDate);
            comment = comment.replace(/<i rel="image">(.*?)<\/i>/ig, "<img class'center' src='$1' alt='Loading...'>").replace(/<i rel="code">(.*?)<\/i>/ig, "<code><a href='" + domain + "\/p\/search.html?q=$1'>$1<\/a><\/code>").replace(/<i rel="pre">(.*?)<\/i>/g, "<pre>$1</pre>");
            d += '<li tabindex="0" class="item' + p + '">';
            d += '<div class="face">' + imgcode + '</div>';
            if (comment.length < maxCommentChars) {
                d += '<div class="notification-post"><strong class="title"><a href="' + l + '" target="_blank">' + h + '</a> Wrote a comment on <a href="' + e + '">' + tooltip + '</a></strong><div class="notification-body' + p + '">' + comment + '</div></div>'
            } else {
                comment = comment.substring(0, maxCommentChars);
                var g = comment.lastIndexOf(" ");
                comment = comment.substring(0, g);
                d += '<div class="notification-post"><strong class="title"><a href="' + l + '" target="_blank">' + h + '</a> Wrote a comment on <a href="' + e + '">' + tooltip + '</a></strong><div class="notification-body' + p + '">' + comment + '... <a href="' + e + '">' + txtMore + '</div></div>';
                if (txtMore !== "") {
                    var r = replaceVars(txtMore, h, f, cmtDate)
                }
            }
            d += '<a class="del" href="https://www.blogger.com/delete-comment.g?blogID=6855770180742870192&postID=' + e.split('#c')[1] + '" target="_blank" title="Delete this comment">×</a></li>'
        }
        listContainer.innerHTML = d;
        reloadBtn.innerHTML = "Reload"
    }
}

function appendScript(a, b) {
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.id = b;
    s.src = a;
    if (document.getElementById(b)) {
        var o = document.getElementById(b);
        o.parentNode.removeChild(o)
    }
    headTag.appendChild(s)
}
appendScript(domain + '/feeds/comments/default?redirect=false' + maxResultsComments + '&alt=json-in-script&callback=showRecentComments', "cm-script");
document.getElementById('cm-script').onload = function () {
    appendScript(domain + '/feeds/posts/summary?redirect=false' + maxResultsPosts + '&alt=json-in-script&callback=getPostUrlsForComments', "ptt-script");
    document.getElementById('ptt-script').onload = function () {
        appendScript(domain + '/feeds/comments/default?redirect=false' + maxResultsComments + '&alt=json-in-script&callback=showRecentComments&nocache=' + (new Date()).getTime(), "cm-script")
    }
};
reloadBtn.onclick = function () {
    appendScript(domain + '/feeds/comments/default?redirect=false&max-results=' + totalFeed + '&alt=json-in-script&callback=showRecentComments&nocache=' + (new Date()).getTime(), "cm-script");
    this.innerHTML = 'Loading...';
    listContainer.innerHTML = '<li>Loading...</li>';
    document.getElementById('loading-text').innerHTML = "";
    document.title = docTitle
};

(function($) {
 function c_c(a,b,c){if(c){var d=new Date();d.setTime(d.getTime()+(c*24*60*60*1000));var e="; expires="+d.toGMTString()}else{var e=""}document.cookie=a+"="+b+e+"; path=/"}function r_c(a){var b=a+"=";var d=document.cookie.split(';');for(var i=0;i<d.length;i++){var c=d[i];while(c.charAt(0)==' '){c=c.substring(1,c.length)}if(c.indexOf(b)==0){return c.substring(b.length,c.length)}}return null}function e_c(a){c_c(a,"",-1)}
 $('.notif-btn').show();
 $('#enable-disable').on("click", function() {
  if ($(this).hasClass('no')) {
   e_c('disable-notification');
   $(this).removeClass('no').text('Disable Notifications');
  } else {
   c_c('disable-notification', null, 7000);
   $(this).addClass('no').text('Enable Notifications');
  }
 });
 if (r_c('disable-notification')) {
  $('#enable-disable').addClass('no').text('Enable Notifications');
 } else {
  $('#enable-disable').text('Disable Notifications');
 }
})(jQuery);