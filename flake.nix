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
      in
      {
        devShells = rec {
          default = site;
          site = pkgs.devshell.mkShell {
            name = "site";
            packages = [
              bun
              nodejs
            ];
            devshell.startup.link.text = ''
              mkdir -p "$PRJ_DATA_DIR/current"
              ln -sfn ${bun} "$PRJ_DATA_DIR/current/bun"
              ln -sfn ${nodejs} "$PRJ_DATA_DIR/current/nodejs"
            '';
            devshell.startup.version_info.text = ''
              echo "---Kalneslopene development environment---"
              echo "bun: $(${bun}/bin/bun --version)"
              echo "claude: $(${nodejs}/bin/node --version)"
              echo "----------------------------------------"
            '';
          };
        };
      }
    );
}
