resolvers ++= Seq(
    DefaultMavenRepository,
    Resolver.url("Play", url("http://download.playframework.org/ivy-releases/"))(Resolver.ivyStylePatterns),
    "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
    Resolver.url("sbt-plugin-releases",url("http://scalasbt.artifactoryonline.com/scalasbt/sbt-plugin-releases/"))(Resolver.ivyStylePatterns)
)

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "0.6.2")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.9.2")

addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.7.4")