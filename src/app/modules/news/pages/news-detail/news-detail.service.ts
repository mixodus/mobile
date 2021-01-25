import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../../services/global.service';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { NewsResponse } from '../../../../core/models/news/NewsResponse';

@Injectable({
  providedIn: 'root'
})

export class NewsDetailService {
  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService
  ) {
  }

  objComment = {};


  getNewsComment(newsId) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const newsDetailEndpoint =
      this.globalService.apiUrl +
      'api/news/comment' + '?news_id=' + newsId;

    return this.http.get<NewsResponse>(newsDetailEndpoint, options);
  }

  formattingCommentData(commentData: any) {
    return {
      commentTotal: commentData.comment_total,
      comments: this.extractingComments(commentData.comments)
    };
  }

  extractingComments(comments: any[]) {
    const extractedComments = [];

    comments.forEach((comment: any) => {
      extractedComments.push(
        {
          commentId: comment.comment_id,
          userId: comment.user_id,
          fullName: comment.user.fullname,
          profilePict: comment.user.profile_picture_url,
          comment: comment.comment,
          commentReplies: this.extractingCommentReplies(comment.comment_replies),
          dateCreated: comment.date_created,
          timeCreated: comment.time_created
        }
      );
    });
    return extractedComments;
  }

  extractingCommentReplies(commentReplies: any[]) {
    const extractedCommentReplies = [];

    commentReplies.forEach((reply: any) => {
      extractedCommentReplies.push(
        {
          replyId: reply.reply_id,
          userId: reply.user.user_id,
          fullName: reply.user.fullname,
          profilePict: reply.user.profile_picture_url,
          comment: reply.comment,
          dateCreated: reply.date_created,
          timeCreated: reply.time_created
        }
      );
    });

    return extractedCommentReplies;
  }

  postNewsComment(type: string, typeId: string, comment: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImlkIjo3NjI2fSwiaWF0IjoxNjExMjM0MTkxLCJleHAiOjE2MTE4Mzg5OTF9.DPU16RA8RVsMKLPzI-c8d8_nxOmeWVE2I27oAW8v0FY'
    });
    const options = { headers: headers };

    const newsDetailEndpoint = this.globalService.apiUrl + 'api/news/comment';


    if (type === 'comment') {
      this.objComment = {
        type: type,
        comment: comment,
        news_id: typeId
      };
    } else {
      this.objComment = {
        type: type,
        comment: comment,
        comment_id: typeId
      };
    }

    const body = JSON.stringify(this.objComment);

    return this.http.post(newsDetailEndpoint, body, options);
  }
}
