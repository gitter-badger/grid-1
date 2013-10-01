package controllers

import play.api.mvc._
import play.api.Logger

import lib.imaging.ImageMetadata
import lib.storage.DevNullStorage
import lib.SNS
import play.api.libs.json.Json


object Application extends Controller {

  val storage = DevNullStorage

  def index = Action {
    Ok("This is the Image Loader API.\r\n")
  }

  def putImage(id: String) = Action(parse.temporaryFile) { request =>
    val tempFile = request.body

    val meta = ImageMetadata.iptc(tempFile.file)
    val uri = storage.store(tempFile.file)
    val image = model.Image(id, uri, meta)

    SNS.publish(Json.stringify(Json.toJson(image)), Some("image"))

    tempFile.clean()
    NoContent
  }

}