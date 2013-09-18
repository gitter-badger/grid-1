import sbt._
import sbt.Keys._

object Plugins extends Build {

  val plugins = Project("plugins", file("."))
    .dependsOn(uri("git://github.com/guardian/sbt-dist-plugin.git#1.7"))
    .settings(
      resolvers ++= Seq(
        DefaultMavenRepository,
        Resolver.url("Play", url("http://download.playframework.org/ivy-releases/"))(Resolver.ivyStylePatterns),
        "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
        Resolver.url("sbt-plugin-releases",url("http://scalasbt.artifactoryonline.com/scalasbt/sbt-plugin-releases/"))(Resolver.ivyStylePatterns)
      ),
      addSbtPlugin("play" % "sbt-plugin" % "2.1.3"),
      addSbtPlugin("com.gu" % "sbt-teamcity-test-reporting-plugin" % "1.3"),
      addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.9.2"),
      addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.7.4")
    )

}