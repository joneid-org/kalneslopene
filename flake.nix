{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    # Pinned to the last commit before jdk24 was removed from nixpkgs (EOL on 2025-10-04).
    nixpkgs-jdk24.url = "github:nixos/nixpkgs/c8f3f1665a102748eba941a60866ff46cf0203d1";
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
      nixpkgs-jdk24,
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

        pkgsJdk24 = import nixpkgs-jdk24 {
          inherit system;
          config.allowUnfree = true;
        };

        bun = pkgs.bun;
        nodejs = pkgs.nodejs;
        jdk = pkgsJdk24.jdk24_headless;
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
