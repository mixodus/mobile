export interface NewsComment {
  commentTotal: number;
  comments: NewsCommentsDetail[];
}

export interface NewsCommentsDetail {
  commentId: string;
  userId: string;
  fullName: string;
  profilePict: string;
  comment: string;
  commentReplies: NewsReplies[];
  dateCreated: string;
  timeCreated: string;
}

export interface NewsReplies {
  replyId: string;
  userId: string;
  fullName: string;
  profilePict: string;
  comment: string;
  dateCreated: string;
  timeCreated: string;
}
