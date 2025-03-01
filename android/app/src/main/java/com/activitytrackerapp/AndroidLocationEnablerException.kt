package com.activitytrackerapp


class AndroidLocationEnablerException : Exception {
  constructor(detailMessage: String?, throwable: Throwable?) : super(detailMessage, throwable)
  constructor(detailMessage: String?) : super(detailMessage)
}