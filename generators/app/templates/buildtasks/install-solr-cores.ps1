function Set-SolrCores($solrCleanCores, $solrCoresPath)
{
    # Copy cores

if(!(Test-Path $solrCleanCores))
{ 
    Write-Host "Solr clean cores package not found, make sure the package is correctly configured" -ForegroundColor Red
    exit 1
}

	if(!(Test-Path $solrCoresPath))
{ 
    Write-Host "Solr installation folder not found, make sure the Gulp config file has the correct location" -ForegroundColor Red
    exit 1
}

$solrServiceName="solrJetty"

Write-Host "Unpacking clean Solr Sitecore cores"
if(!(Test-Path "$solrCoresPath\sitecore_core_index"))
{
    Expand-ZipFile $solrCleanCores -Destination $solrCoresPath
    if(!(Test-Path "$solrCoresPath\sitecore_core_index"))
    {
        Write-Host "Couldn't extract solr cores, check error messages and fix accordingly" -ForegroundColor Red
        exit 1
    }

    Write-Host "Correctly unpacked Sitecore solr cores"

    # Restart Solr to re-read cores
    Write-Host "Restarting Solr service to re read cores"
    Stop-Service -Name $solrServiceName
    Start-Sleep $serviceStopWaitTime
    Start-Service -Name $solrServiceName
    Write-Host "Done restarting"

}
else 
{
    Write-Host "Solr cores already installed in $solrCoresPath"
}


Write-Host "Solr installed correctly" -ForegroundColor Green
exit 0
}

<#
    .SYNOPSIS
        Extract the content of the referenced zip file to the defind destination

    .PARAMATER Path
        Path to a zip file with the file extension '.zip'

    .Parameter Destination
        Path to which the zip content is extracted
#>
Function Expand-ZipFile {
    [CmdletBinding()]
    param (
        [Parameter(Position=0, Mandatory=$true)]
        [String] $Path,

        [Parameter(Position=1, Mandatory=$true)]
        [String] $Destination
    )
    process {
        Write-Debug "Unzipping $Path to $Destination..."

        # Check if powershell v3+ and .net v4.5 is available
        $netFailed = $true
        if ( $PSVersionTable.PSVersion.Major -ge 5) { 
            try {
                Expand-Archive $Path $Destination
                $netFailed = $false
            }
            catch {
            }
        }elseif  ( $PSVersionTable.PSVersion.Major -ge 3 -and (Get-ChildItem -Path 'HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4' -Recurse | Get-ItemProperty -Name Version | Where-Object { $_.Version -like '4.5*' }) ) {
            Write-Debug 'Attempting unzip using the .NET Framework...'

            try {
                [System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem")
                [System.IO.Compression.ZipFile]::ExtractToDirectory($Path, $Destination)
                $netFailed = $false
            }
            catch {
            }
        }

        if ($netFailed) {
            try {
                Write-Debug 'Attempting unzip using the Windows Shell...'
                $shellApp = New-Object -Com Shell.Application
                $shellZip = $shellApp.NameSpace([String]$Path)
                $shellDest = $shellApp.NameSpace($Destination)
                $shellDest.CopyHere($shellZip.items())
            }
            catch {
                $shellFailed = $true
            }
        }

        # if failure already registered or no result
        if (($netFailed -and $shellFailed) -or ((Get-ChildItem $Destination | Measure-Object | Where-Object { $_.Count -eq 0}))) {
            Write-Warning 'We were unable to decompress the zip file. This tends to mean both of the following are true:'
            Write-Warning '1. You''ve disabled Windows Explorer Zip file integration or are running on Windows Server Core.'
            Write-Warning '2. You don''t have the .NET Framework 4.5 installed.'
            Write-Warning 'You''ll need to correct at least one of the above issues depending on your installation to proceed.'
            throw 'Unable to unzip file!'
        }
    }
}