{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-utils = {
      url = "github:numtide/flake-utils";
    };
  };
  outputs =
    {
      nixpkgs,
      devshell,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [
            devshell.overlays.default
          ];
        };

        bun = pkgs.bun;
        nodejs = pkgs.nodejs;
        jdk = pkgs.jdk25_headless;
        opentofu = pkgs.opentofu;
      in
      {
        devShells = rec {
          default = site;
          site = pkgs.devshell.mkShell {
            name = "site";
            packages = [
              bun
              nodejs
              jdk
              opentofu
            ];
            devshell.startup.link.text = ''
              mkdir -p "$PRJ_DATA_DIR/current"
              ln -sfn ${bun} "$PRJ_DATA_DIR/current/bun"
              ln -sfn ${nodejs} "$PRJ_DATA_DIR/current/nodejs"
              ln -sfn ${jdk} "$PRJ_DATA_DIR/current/jdk"
            '';
            devshell.startup.version_info.text = ''
              echo "-----Kalneslopene development environment-----"
              echo "bun: $(${bun}/bin/bun --version)"
              echo "node: $(${nodejs}/bin/node --version)"
              echo "opentofu: $(${opentofu}/bin/tofu --version)"
              echo "$(${jdk}/bin/java --version)"
              echo "----------------------------------------------"
            '';
          };
        };
      }
    );
}
