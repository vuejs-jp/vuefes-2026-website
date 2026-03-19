{
  description = "Development environment for vuefes-2026";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forEachSystem = f:
        nixpkgs.lib.genAttrs systems (system:
          f {
            pkgs = import nixpkgs { inherit system; };
            inherit system;
          });

      projectRoot = builtins.toString ./.;
    in
    {
      devShells = forEachSystem ({ pkgs, system }: {
        default = pkgs.mkShell {
          name = "vuefes-2026";

          packages = with pkgs; [
            curl
            git
            nodejs_24
            terraform
          ];

          shellHook = ''
            export PATH="${projectRoot}/node_modules/.bin:$PATH"
          '';
        };
      });
    };
}
