import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import {
  NotificationEvent,
  SubmissionPayload,
  AssignmentPayload,
  ReviewPayload,
  FilePayload,
} from './notifications.events';

@Injectable()
export class NotificationsListener {
  constructor(private readonly notifications: NotificationsService) {}

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async notify(
    type: any,
    message: string,
    payload: { recipientIds: string[]; entityType: string; entityId: string },
  ) {
    if (!payload.recipientIds.length) return;
    await this.notifications.createMany(
      payload.recipientIds.map((recipientId) => ({
        type,
        message,
        recipientId,
        entityType: payload.entityType,
        entityId: payload.entityId,
      })),
    );
  }

  private reviewLabel(type: 'SUPERVISOR' | 'OPPONENT') {
    return type === 'SUPERVISOR' ? 'Supervisor' : 'Opponent';
  }

  // ── Submissions ────────────────────────────────────────────────────────────

  @OnEvent(NotificationEvent.SUBMISSION_APPROVED)
  async onSubmissionApproved(p: SubmissionPayload) {
    await this.notify(
      'SUBMISSION_APPROVED',
      `Submission "${p.submissionTopic}" was approved by ${p.actorName}`,
      p,
    );
  }

  @OnEvent(NotificationEvent.SUBMISSION_REJECTED)
  async onSubmissionRejected(p: SubmissionPayload) {
    await this.notify(
      'SUBMISSION_REJECTED',
      `Submission "${p.submissionTopic}" was rejected by ${p.actorName}`,
      p,
    );
  }

  @OnEvent(NotificationEvent.SUBMISSION_SUBMITTED)
  async onSubmissionSubmitted(p: SubmissionPayload) {
    await this.notify(
      'SUBMISSION_SUBMITTED',
      `Submission "${p.submissionTopic}" was submitted by ${p.actorName}`,
      p,
    );
  }

  @OnEvent(NotificationEvent.SUBMISSION_EDITED)
  async onSubmissionEdited(p: SubmissionPayload) {
    await this.notify(
      'SUBMISSION_EDITED',
      `Submission "${p.submissionTopic}" was edited by ${p.actorName}`,
      p,
    );
  }

  @OnEvent(NotificationEvent.SUBMISSION_DELETED)
  async onSubmissionDeleted(p: SubmissionPayload) {
    await this.notify(
      'SUBMISSION_DELETED',
      `Submission "${p.submissionTopic}" was deleted by ${p.actorName}`,
      p,
    );
  }

  @OnEvent(NotificationEvent.SUBMISSION_OPPONENT_ASSIGNED)
  async onSubmissionOpponentAssigned(p: SubmissionPayload) {
    await this.notify(
      'SUBMISSION_OPPONENT_ASSIGNED',
      `${p.actorName} was assigned as opponent for submission "${p.submissionTopic}"`,
      p,
    );
  }

  // ── Assignments ────────────────────────────────────────────────────────────

  @OnEvent(NotificationEvent.ASSIGNMENT_PICKED)
  async onAssignmentPicked(p: AssignmentPayload) {
    await this.notify(
      'ASSIGNMENT_PICKED',
      `Assignment "${p.assignmentTopic}" was picked by ${p.actorName}`,
      p,
    );
  }

  @OnEvent(NotificationEvent.ASSIGNMENT_UNPICKED)
  async onAssignmentUnpicked(p: AssignmentPayload) {
    await this.notify(
      'ASSIGNMENT_UNPICKED',
      `Assignment "${p.assignmentTopic}" was unpicked by ${p.actorName}`,
      p,
    );
  }

  // ── Reviews ────────────────────────────────────────────────────────────────

  @OnEvent(NotificationEvent.REVIEW_CREATED)
  async onReviewCreated(p: ReviewPayload) {
    await this.notify(
      'REVIEW_CREATED',
      `${this.reviewLabel(p.reviewType)} review for submission "${p.submissionTopic}" was created by ${p.actorName}`,
      p,
    );
  }

  @OnEvent(NotificationEvent.REVIEW_EDITED)
  async onReviewEdited(p: ReviewPayload) {
    await this.notify(
      'REVIEW_EDITED',
      `${this.reviewLabel(p.reviewType)} review for submission "${p.submissionTopic}" was edited by ${p.actorName}`,
      p,
    );
  }

  @OnEvent(NotificationEvent.REVIEW_DELETED)
  async onReviewDeleted(p: ReviewPayload) {
    await this.notify(
      'REVIEW_DELETED',
      `${this.reviewLabel(p.reviewType)} review for submission "${p.submissionTopic}" was deleted by ${p.actorName}`,
      p,
    );
  }

  // ── Files — main (TEXT) ───────────────────────────────────────────────────

  @OnEvent(NotificationEvent.FILE_MAIN_UPLOADED)
  async onFileMainUploaded(p: FilePayload) {
    await this.notify(
      'FILE_MAIN_UPLOADED',
      `Main file "${p.filename}" for submission "${p.submissionTopic}" was uploaded`,
      p,
    );
  }

  @OnEvent(NotificationEvent.FILE_MAIN_EDITED)
  async onFileMainEdited(p: FilePayload) {
    await this.notify(
      'FILE_MAIN_EDITED',
      `Main file "${p.filename}" for submission "${p.submissionTopic}" was replaced`,
      p,
    );
  }

  @OnEvent(NotificationEvent.FILE_MAIN_DELETED)
  async onFileMainDeleted(p: FilePayload) {
    await this.notify(
      'FILE_MAIN_DELETED',
      `Main file "${p.filename}" for submission "${p.submissionTopic}" was deleted`,
      p,
    );
  }

  // ── Files — attachments (FILES) ───────────────────────────────────────────

  @OnEvent(NotificationEvent.FILE_ATTACHMENT_UPLOADED)
  async onFileAttachmentUploaded(p: FilePayload) {
    await this.notify(
      'FILE_ATTACHMENT_UPLOADED',
      `Attachment "${p.filename}" for submission "${p.submissionTopic}" was uploaded`,
      p,
    );
  }

  @OnEvent(NotificationEvent.FILE_ATTACHMENT_EDITED)
  async onFileAttachmentEdited(p: FilePayload) {
    await this.notify(
      'FILE_ATTACHMENT_EDITED',
      `Attachment "${p.filename}" for submission "${p.submissionTopic}" was replaced`,
      p,
    );
  }

  @OnEvent(NotificationEvent.FILE_ATTACHMENT_DELETED)
  async onFileAttachmentDeleted(p: FilePayload) {
    await this.notify(
      'FILE_ATTACHMENT_DELETED',
      `Attachment "${p.filename}" for submission "${p.submissionTopic}" was deleted`,
      p,
    );
  }

  // ── Files — review documents (REVIEWS) ────────────────────────────────────

  @OnEvent(NotificationEvent.FILE_UPLOADED)
  async onFileUploaded(p: FilePayload) {
    await this.notify(
      'FILE_UPLOADED',
      `Review file "${p.filename}" for submission "${p.submissionTopic}" was uploaded`,
      p,
    );
  }

  @OnEvent(NotificationEvent.FILE_EDITED)
  async onFileEdited(p: FilePayload) {
    await this.notify(
      'FILE_EDITED',
      `Review file "${p.filename}" for submission "${p.submissionTopic}" was replaced`,
      p,
    );
  }

  @OnEvent(NotificationEvent.FILE_DELETED)
  async onFileDeleted(p: FilePayload) {
    await this.notify(
      'FILE_DELETED',
      `Review file "${p.filename}" for submission "${p.submissionTopic}" was deleted`,
      p,
    );
  }
}
